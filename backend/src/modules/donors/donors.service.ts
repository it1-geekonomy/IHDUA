import { randomUUID } from 'crypto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonationStatus } from '../../common/enums/donation-status.enum';
import { DonationCategory } from '../../common/enums/donation-category.enum';
import { RazorpayService } from '../../common/payments/razorpay.service';
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
  state?: string;
  city?: string;
  pincode?: string;
  message?: string;
  donationCategory?: string;
  amount?: string;
  currency?: string;
  countryCode?: string;
  countryName?: string;
};

@Injectable()
export class DonorsService {
  constructor(
    @InjectRepository(Donor)
    private readonly donorsRepository: Repository<Donor>,
    private readonly razorpay: RazorpayService,
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

  private buildReceiptNumber(id: string): string {
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `IHDUA-${stamp}-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
  }

  /** Creates a Razorpay order only — no donors row until payment succeeds. */
  async createOrder(dto: CreateDonationOrderDto) {
    const currency = (dto.currency ?? 'INR') as DonationCurrencyCode;
    const amountMinor = this.toMinorUnits(dto.amount, currency);

    const fullName = dto.fullName.trim();
    const phone = dto.phone.trim();
    const email = dto.email.trim().toLowerCase();
    const pan = dto.pan?.trim().toUpperCase() || '';
    const address = dto.address?.trim() || '';
    const state = dto.state?.trim() || '';
    const city = dto.city?.trim() || '';
    const pincode = dto.pincode?.trim() || '';
    const message = dto.message?.trim() || '';
    const donationCat = dto.donationCategory || DonationCategory.GENERAL_DONATION;
    const countryCode = dto.countryCode?.trim().toUpperCase() || '';
    const countryName = dto.countryName?.trim() || '';

    try {
      const order = await this.razorpay.createOrder({
        amountPaise: amountMinor,
        currency,
        receipt: `ihdua_${Date.now()}`,
        notes: {
          fullName,
          phone,
          email,
          pan,
          address,
          state,
          city,
          pincode,
          message,
          donationCategory: donationCat,
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
        keyId: this.razorpay.getKeyId(),
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
      state: notes.state || null,
      city: notes.city || notes.countryName || notes.countryCode || null,
      pincode: notes.pincode || null,
      message: notes.message || null,
      donationCategory: (notes.donationCategory as DonationCategory) || DonationCategory.GENERAL_DONATION,
      amount: amountMajor,
      currency,
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      status: DonationStatus.PAID,
      receiptNumber: this.buildReceiptNumber(donorId),
    });

    const saved = await this.donorsRepository.save(donor);

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
