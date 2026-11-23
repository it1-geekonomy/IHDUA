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
import { DonationDocumentsService } from './donation-documents.service';
import { DonationEmailQueueService } from './donation-email-queue.service';
import { Donor } from './entities/donor.entity';
import {
  CreateDonationOrderDto,
  DonationCurrencyCode,
} from './dto/create-donation-order.dto';
import { CreateManualDonationDto } from './dto/create-manual-donation.dto';
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
    private readonly documents: DonationDocumentsService,
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

    const pan = isIndianDonation ? dto.pan?.trim().toUpperCase() || '' : '';
    const address = dto.address?.trim() || '';
    const amountMajor = Number(dto.amount);

    // Donations of ₹2,000 or more need PAN + address.
    if (
      isIndianDonation &&
      Number.isFinite(amountMajor) &&
      amountMajor >= 2000
    ) {
      if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
        throw new BadRequestException(
          'PAN Card No. is required for donations of ₹2,000 or more.',
        );
      }
      if (!address) {
        throw new BadRequestException(
          'Address is required for donations of ₹2,000 or more.',
        );
      }
    }

    return {
      fullName: dto.fullName.trim(),
      phone: dto.phone.trim(),
      email: dto.email.trim().toLowerCase(),
      pan,
      address,
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

    // Razorpay foreign NGO payments are disabled; overseas donors use FCRA remittance.
    if (!d.isIndianDonation || d.currency !== 'INR') {
      throw new BadRequestException(
        'Online checkout is available for India (INR) only. Overseas donors should use FCRA bank remittance.',
      );
    }

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
      city: notes.city || null,
      countryCode: notes.countryCode?.trim().toUpperCase() || null,
      countryName: notes.countryName?.trim() || null,
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

  /**
   * Admin: add an offline / foreign / cash donor. Saves the ledger row and
   * stores certificate (+ 80G when PAN) on the donor — same as online paid flow.
   */
  async issueOfflineDocuments(dto: CreateManualDonationDto) {
    const countryCode = dto.countryCode?.trim().toUpperCase() || 'IN';
    const isIndia = countryCode === 'IN';
    const currency = (dto.currency ??
      (isIndia ? 'INR' : 'USD')) as DonationCurrencyCode;

    // Foreign donations never use Indian PAN / 80G path.
    const d = this.prepareDonation({
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email,
      amount: dto.amount,
      currency,
      donationCategory: dto.donationCategory,
      pan: isIndia ? dto.pan : undefined,
      address: dto.address,
      city: dto.city,
      message: dto.message,
      countryCode,
      countryName:
        dto.countryName?.trim() || (isIndia ? 'India' : 'Outside India'),
    });

    let donatedAt = new Date();
    if (dto.donatedAt) {
      donatedAt = new Date(dto.donatedAt);
      if (Number.isNaN(donatedAt.getTime())) {
        throw new BadRequestException('donatedAt must be a valid date');
      }
    }

    const paymentMode = dto.paymentMode ?? 'cash';
    const offlineRef = dto.offlineReference?.trim() || '';
    const donorId = randomUUID();
    const receiptNumber = this.buildReceiptNumber(donorId);
    const countryLabel =
      d.countryName || (isIndia ? 'India' : 'Outside India');
    const originNote = isIndia
      ? 'India'
      : `Foreign / ${countryLabel}${countryCode && countryCode !== 'OUT' ? ` (${countryCode})` : ''}`;
    const message = [
      d.message,
      `Offline donation (${originNote}, ${paymentMode}${offlineRef ? `: ${offlineRef}` : ''})`,
    ]
      .filter(Boolean)
      .join('\n');

    const wantEmail = dto.sendEmail === true;
    const donor = this.donorsRepository.create({
      id: donorId,
      fullName: d.fullName,
      phone: d.phone,
      email: d.email,
      pan: isIndia && d.pan ? d.pan : null,
      address: d.address || null,
      city: d.city || null,
      countryCode: isIndia ? 'IN' : countryCode || null,
      countryName: countryLabel,
      message: message || null,
      donationCategory: d.donationCategory,
      amount: d.amount,
      currency: d.currency,
      receiptNumber,
      razorpayOrderId: null,
      razorpayPaymentId: null,
      status: DonationStatus.PAID,
      ...(wantEmail ? DonationEmailQueueService.queuedFields() : {}),
    });

    const saved = await this.donorsRepository.save(donor);

    // Honour admin-chosen donation date on the ledger row.
    if (dto.donatedAt) {
      await this.donorsRepository.update(saved.id, { createdAt: donatedAt });
      saved.createdAt = donatedAt;
    }

    // Build + store PDFs on the donor (R2 URLs), same path the email queue uses.
    await this.documents.prepare(saved);

    if (wantEmail) {
      this.emailQueue.kick();
    }

    this.logger.log(
      `Offline donor saved id=${saved.id} receipt=${receiptNumber} email=${wantEmail ? 'queued' : 'none'}`,
    );

    return {
      donorId: saved.id,
      receiptNumber,
      fullName: d.fullName,
      email: d.email,
      amount: d.amount,
      currency: d.currency,
      donationCategory: d.donationCategory,
      pan: saved.pan,
      donatedAt: (saved.createdAt ?? donatedAt).toISOString(),
      certificateUrl: saved.certificateUrl ?? null,
      receiptUrl: saved.receiptUrl ?? null,
      emailStatus: wantEmail ? ('queued' as const) : null,
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
