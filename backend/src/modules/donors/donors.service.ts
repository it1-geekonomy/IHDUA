import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { Repository } from 'typeorm';
import { DonationStatus } from './donation-status.enum';
import { Donor } from './donor.entity';
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
  amount?: string;
  currency?: string;
  countryCode?: string;
  countryName?: string;
};

@Injectable()
export class DonorsService {
  private razorpayClient: Razorpay | null = null;

  constructor(
    @InjectRepository(Donor)
    private readonly donorsRepository: Repository<Donor>,
    private readonly config: ConfigService,
  ) {}

  private getRazorpay(): Razorpay {
    if (this.razorpayClient) return this.razorpayClient;

    const keyId = this.config.get<string>('razorpay.keyId', '');
    const keySecret = this.config.get<string>('razorpay.keySecret', '');

    if (!keyId || !keySecret) {
      throw new InternalServerErrorException(
        'Razorpay credentials are not configured',
      );
    }

    this.razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    return this.razorpayClient;
  }

  private assertPaymentSignature(dto: VerifyDonationPaymentDto) {
    const keySecret = this.config.get<string>('razorpay.keySecret', '');
    const payload = `${dto.razorpayOrderId}|${dto.razorpayPaymentId}`;
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    if (expected !== dto.razorpaySignature) {
      throw new BadRequestException('Invalid payment signature');
    }
  }

  private toMinorUnits(amount: string, currency: DonationCurrencyCode) {
    const major = Number(amount);
    // Razorpay uses the smallest currency unit (paise/cents). All supported
    // currencies here are 2-decimal.
    const minor = major * 100;
    if (!Number.isSafeInteger(minor) || minor < 100) {
      throw new BadRequestException(
        `Minimum donation amount is 1 ${currency}`,
      );
    }
    return minor;
  }

  /** Creates a Razorpay order only — no donors row until payment succeeds. */
  async createOrder(dto: CreateDonationOrderDto) {
    const currency = (dto.currency ?? 'INR') as DonationCurrencyCode;
    const amountMinor = this.toMinorUnits(dto.amount, currency);

    const fullName = dto.fullName.trim();
    const phone = dto.phone?.trim() || '';
    const email = dto.email?.trim().toLowerCase() || '';
    const pan = dto.pan?.trim().toUpperCase() || '';
    const countryCode = dto.countryCode?.trim().toUpperCase() || '';
    const countryName = dto.countryName?.trim() || '';

    try {
      const order = await this.getRazorpay().orders.create({
        amount: amountMinor,
        currency,
        receipt: `ihdua_${Date.now()}`,
        notes: {
          fullName,
          phone,
          email,
          pan,
          amount: dto.amount,
          currency,
          countryCode,
          countryName,
        },
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: this.config.get<string>('razorpay.keyId'),
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;
      const message =
        error &&
        typeof error === 'object' &&
        'error' in error &&
        error.error &&
        typeof error.error === 'object' &&
        'description' in error.error
          ? String((error.error as { description?: string }).description)
          : 'Failed to create Razorpay order';
      throw new InternalServerErrorException(message);
    }
  }

  /** Verifies Razorpay payment, then inserts the donors row (success only). */
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
      };
    }

    let notes: OrderNotes = {};
    let amountMajor = '';
    let currency = 'INR';

    try {
      const order = await this.getRazorpay().orders.fetch(dto.razorpayOrderId);
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

    const donor = this.donorsRepository.create({
      fullName: notes.fullName,
      phone: notes.phone || null,
      email: notes.email || null,
      pan: notes.pan || null,
      city: notes.countryName || notes.countryCode || null,
      amount: amountMajor,
      currency,
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      status: DonationStatus.SUCCESS,
      receiptNumber: `IHDUA-${Date.now()}`,
    });

    const saved = await this.donorsRepository.save(donor);

    return {
      donorId: saved.id,
      status: saved.status,
      receiptNumber: saved.receiptNumber,
      amount: saved.amount,
      currency: saved.currency,
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
