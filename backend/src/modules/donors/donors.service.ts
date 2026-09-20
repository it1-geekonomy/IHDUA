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
import { CreateDonationOrderDto } from './dto/create-donation-order.dto';
import { VerifyDonationPaymentDto } from './dto/verify-donation-payment.dto';

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

  async createOrder(dto: CreateDonationOrderDto) {
    const amountPaise = Number(dto.amount) * 100;
    if (!Number.isSafeInteger(amountPaise) || amountPaise < 100) {
      throw new BadRequestException('Minimum donation amount is ₹1');
    }

    const donor = this.donorsRepository.create({
      fullName: dto.fullName.trim(),
      phone: dto.phone?.trim() || null,
      email: dto.email?.trim().toLowerCase() || null,
      pan: dto.pan?.trim().toUpperCase() || null,
      amount: dto.amount,
      currency: 'INR',
      status: DonationStatus.PENDING,
    });

    const saved = await this.donorsRepository.save(donor);

    try {
      const order = await this.getRazorpay().orders.create({
        amount: amountPaise,
        currency: 'INR',
        receipt: `donor_${saved.id.slice(0, 8)}`,
        notes: {
          donorId: saved.id,
          fullName: saved.fullName,
        },
      });

      saved.razorpayOrderId = order.id;
      await this.donorsRepository.save(saved);

      return {
        donorId: saved.id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: this.config.get<string>('razorpay.keyId'),
      };
    } catch (error) {
      saved.status = DonationStatus.FAILED;
      await this.donorsRepository.save(saved);

      if (error instanceof InternalServerErrorException) throw error;

      throw new InternalServerErrorException('Failed to create Razorpay order');
    }
  }

  async verifyPayment(dto: VerifyDonationPaymentDto) {
    const donor = await this.donorsRepository.findOne({
      where: { id: dto.donorId },
    });

    if (!donor) {
      throw new NotFoundException('Donation record not found');
    }

    if (
      donor.razorpayOrderId &&
      donor.razorpayOrderId !== dto.razorpayOrderId
    ) {
      throw new BadRequestException('Order ID mismatch');
    }

    const keySecret = this.config.get<string>('razorpay.keySecret', '');
    const payload = `${dto.razorpayOrderId}|${dto.razorpayPaymentId}`;
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    if (expected !== dto.razorpaySignature) {
      donor.status = DonationStatus.FAILED;
      await this.donorsRepository.save(donor);
      throw new BadRequestException('Invalid payment signature');
    }

    donor.razorpayOrderId = dto.razorpayOrderId;
    donor.razorpayPaymentId = dto.razorpayPaymentId;
    donor.status = DonationStatus.SUCCESS;
    if (!donor.receiptNumber) {
      donor.receiptNumber = `IHDUA-${Date.now()}`;
    }

    await this.donorsRepository.save(donor);

    return {
      donorId: donor.id,
      status: donor.status,
      receiptNumber: donor.receiptNumber,
      amount: donor.amount,
      currency: donor.currency,
    };
  }
}
