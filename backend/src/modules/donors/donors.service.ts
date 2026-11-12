import { randomUUID } from 'crypto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonationStatus } from '../../common/enums/donation-status.enum';
import { DonationCategory } from '../../common/enums/donation-category.enum';
import { RazorpayService } from '../../common/payments/razorpay.service';
import { DonationEmailQueueService } from './donation-email-queue.service';
import { Donor } from './entities/donor.entity';
import {
  CreateDonationOrderDto,
  DonationCurrencyCode,
} from './dto/create-donation-order.dto';
import { VerifyDonationPaymentDto } from './dto/verify-donation-payment.dto';

type OrderNotes = {
  fullName?: string;
  phone?: string;
  email?: string;
  pan?: string;
  address?: string;
  city?: string;
  message?: string;
  donationCategory?: string;
  amount?: string;
  currency?: string;
  countryCode?: string;
  countryName?: string;
};

@Injectable()
export class DonorsService {
  private readonly logger = new Logger(DonorsService.name);

  constructor(
    @InjectRepository(Donor)
    private readonly donorsRepository: Repository<Donor>,
    private readonly razorpay: RazorpayService,
    private readonly emailQueue: DonationEmailQueueService,
  ) {}

  private assertPaymentSignature(dto: VerifyDonationPaymentDto) {
    const isValid = this.razorpay.verifyPaymentSignature(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid payment signature');
    }
  }

  private toMinorUnits(amount: string, currency: DonationCurrencyCode) {
    const major = Number(amount);
    // Razorpay uses the smallest currency unit (paise/cents). All supported
    // currencies here are 2-decimal.
    const minor = major * 100;
    if (!Number.isSafeInteger(minor) || minor < 100) {
      throw new BadRequestException(`Minimum donation amount is 1 ${currency}`);
    }
    return minor;
  }

  buildReceiptNumber(id: string): string {
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `IHDUA-${stamp}-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
  }

  /** Razorpay SDK errors carry the reason in `error.description`. */
  razorpayErrorReason(error: unknown): string {
    if (error && typeof error === 'object') {
      const inner = (error as { error?: { description?: string } }).error;
      if (inner?.description) return String(inner.description);
      if ('message' in error) return String((error as Error).message);
    }
    return String(error);
  }

  /** Normalises donor input shared by one-time orders and recurring donations. */
  prepareDonation(dto: CreateDonationOrderDto) {
    const currency = (dto.currency ?? 'INR') as DonationCurrencyCode;
    const countryCode = dto.countryCode?.trim().toUpperCase() || '';
    // PAN (and the 80G receipt it triggers) only applies to donations from India
    const isIndianDonation =
      (!countryCode || countryCode === 'IN') && currency === 'INR';

    return {
      fullName: dto.fullName.trim(),
      phone: dto.phone.trim(),
      email: dto.email.trim().toLowerCase(),
      pan: isIndianDonation ? dto.pan?.trim().toUpperCase() || '' : '',
      address: dto.address?.trim() || '',
      city: dto.city?.trim() || '',
      message: dto.message?.trim() || '',
      donationCategory:
        dto.donationCategory || DonationCategory.GENERAL_DONATION,
      countryCode,
      countryName: dto.countryName?.trim() || '',
      amount: dto.amount,
      amountMinor: this.toMinorUnits(dto.amount, currency),
      currency,
      isIndianDonation,
    };
  }

  /** Creates a Razorpay order only — no donors row until payment succeeds. */
  async createOrder(dto: CreateDonationOrderDto) {
    const d = this.prepareDonation(dto);

    try {
      const order = await this.razorpay.createOrder({
        amountPaise: d.amountMinor,
        currency: d.currency,
        receipt: `ihdua_${Date.now()}`,
        notes: {
          fullName: d.fullName,
          phone: d.phone,
          email: d.email,
          pan: d.pan,
          address: d.address,
          city: d.city,
          message: d.message,
          donationCategory: d.donationCategory,
          amount: d.amount,
          currency: d.currency,
          countryCode: d.countryCode,
          countryName: d.countryName,
        },
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: this.razorpay.getKeyId(),
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;
      const hasReason =
        !!error &&
        typeof error === 'object' &&
        !!(error as { error?: { description?: string } }).error?.description;
      throw new InternalServerErrorException(
        hasReason
          ? this.razorpayErrorReason(error)
          : 'Failed to create Razorpay order',
      );
    }
  }

  /** Verifies `x-razorpay-signature` against the raw body and returns the event. */
  parseRazorpayWebhook(
    rawBody: string | Buffer,
    signature: string,
  ): { event: string; payload: any } {
    if (!signature) {
      throw new BadRequestException('Missing x-razorpay-signature header');
    }
    if (!this.razorpay.verifyWebhookSignature(rawBody, signature)) {
      this.logger.warn('Razorpay webhook signature verification failed.');
      throw new BadRequestException('Invalid webhook signature');
    }

    const raw = Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : rawBody;
    let body: { event?: string; payload?: unknown };
    try {
      body = JSON.parse(raw);
    } catch {
      throw new BadRequestException('Invalid JSON payload in webhook');
    }

    const event = String(body.event ?? '');
    this.logger.log(`Received Razorpay webhook event: ${event}`);
    return { event, payload: body.payload ?? {} };
  }

  /** Verifies Razorpay payment, then inserts the donors row (paid only). */
  async verifyPayment(dto: VerifyDonationPaymentDto) {
    this.assertPaymentSignature(dto);

    const existing = await this.donorsRepository.findOne({
      where: { razorpayPaymentId: dto.razorpayPaymentId },
    });
    if (existing) {
      return {
        donorId: existing.id,
        status: existing.status,
        receiptNumber: existing.receiptNumber,
        amount: existing.amount,
        currency: existing.currency,
        donationCategory: existing.donationCategory,
      };
    }

    let notes: OrderNotes = {};
    let amountMajor = '';
    let currency = 'INR';

    try {
      const order = await this.razorpay.fetchOrder(dto.razorpayOrderId);
      if (order.id !== dto.razorpayOrderId) {
        throw new BadRequestException('Order ID mismatch');
      }
      notes = (order.notes ?? {}) as OrderNotes;
      currency = order.currency || notes.currency || 'INR';
      amountMajor =
        notes.amount || String(Math.round(Number(order.amount) / 100));
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Unable to fetch Razorpay order details',
      );
    }

    if (!notes.fullName) {
      throw new BadRequestException('Donation details missing on order');
    }

    const donorId = randomUUID();
    const donor = this.donorsRepository.create({
      id: donorId,
      fullName: notes.fullName,
      phone: notes.phone || '',
      email: notes.email || '',
      pan: notes.pan || null,
      address: notes.address || null,
      city: notes.city || notes.countryName || notes.countryCode || null,
      message: notes.message || null,
      donationCategory:
        (notes.donationCategory as DonationCategory) ||
        DonationCategory.GENERAL_DONATION,
      amount: amountMajor,
      currency,
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      status: DonationStatus.PAID,
      receiptNumber: this.buildReceiptNumber(donorId),
      ...DonationEmailQueueService.queuedFields(),
    });

    const saved = await this.donorsRepository.save(donor);
    this.emailQueue.kick();

    return {
      donorId: saved.id,
      status: saved.status,
      receiptNumber: saved.receiptNumber,
      amount: saved.amount,
      currency: saved.currency,
      donationCategory: saved.donationCategory,
    };
  }

  findAll() {
    return this.donorsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const donor = await this.donorsRepository.findOne({ where: { id } });
    if (!donor) throw new NotFoundException('Donation not found');
    return donor;
  }
}
