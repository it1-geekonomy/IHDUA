import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly webhookSecret: string;
  private client: Razorpay | null = null;

  constructor(private readonly config: ConfigService) {
    this.keyId = this.config.get<string>('razorpay.keyId') ?? '';
    this.keySecret = this.config.get<string>('razorpay.keySecret') ?? '';
    this.webhookSecret =
      this.config.get<string>('razorpay.webhookSecret') ?? '';
  }

  private getClient(): Razorpay {
    if (this.client) return this.client;
    this.assertConfigured();
    this.client = new Razorpay({
      key_id: this.keyId,
      key_secret: this.keySecret,
    });
    return this.client;
  }

  getKeyId(): string {
    this.assertConfigured();
    return this.keyId;
  }

  async createOrder(params: {
    amountPaise: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<{ id: string; amount: number; currency: string }> {
    const client = this.getClient();
    const order = await client.orders.create({
      amount: params.amountPaise,
      currency: params.currency,
      receipt: params.receipt,
      notes: params.notes,
      payment_capture: 1,
      payment: {
        capture: 'automatic',
        capture_options: {
          automatic_expiry_period: 12,
          manual_expiry_period: 7200,
          refund_speed: 'optimum',
        },
      },
    } as any);
    this.logger.log(`Razorpay order created: ${order.id}`);
    return {
      id: String(order.id),
      amount: Number(order.amount),
      currency: String(order.currency),
    };
  }

  async capturePayment(
    paymentId: string,
    amountPaise: number,
    currency: string = 'INR',
  ): Promise<any> {
    const client = this.getClient();
    try {
      const captured = await client.payments.capture(
        paymentId,
        amountPaise,
        currency,
      );
      this.logger.log(`Razorpay payment captured successfully: ${paymentId}`);
      return captured;
    } catch (err: any) {
      const desc = err?.error?.description || err?.message || '';
      if (/already\s+been\s+captured/i.test(desc)) {
        this.logger.log(`Razorpay payment ${paymentId} was already captured.`);
        return null;
      }
      throw err;
    }
  }

  async fetchOrder(orderId: string): Promise<{
    id: string;
    amount: number;
    currency: string;
    notes: Record<string, string>;
  }> {
    const client = this.getClient();
    const order = await client.orders.fetch(orderId);
    const notes = (order.notes ?? {}) as Record<string, string>;
    return {
      id: String(order.id),
      amount: Number(order.amount),
      currency: String(order.currency),
      notes,
    };
  }

  async fetchPayment(paymentId: string): Promise<any> {
    const client = this.getClient();
    const payment = await client.payments.fetch(paymentId);
    return payment;
  }

  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean {
    this.assertConfigured();
    const expected = createHmac('sha256', this.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    try {
      return timingSafeEqual(
        Buffer.from(expected, 'utf8'),
        Buffer.from(signature, 'utf8'),
      );
    } catch {
      return false;
    }
  }

  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    if (!this.webhookSecret) {
      this.logger.warn('Razorpay webhook secret is not configured.');
      return false;
    }
    if (!signature) {
      return false;
    }
    const bodyString = Buffer.isBuffer(rawBody)
      ? rawBody.toString('utf8')
      : String(rawBody);
    const expected = createHmac('sha256', this.webhookSecret)
      .update(bodyString)
      .digest('hex');
    try {
      return timingSafeEqual(
        Buffer.from(expected, 'utf8'),
        Buffer.from(signature, 'utf8'),
      );
    } catch {
      return false;
    }
  }

  private assertConfigured() {
    if (!this.keyId || !this.keySecret) {
      throw new InternalServerErrorException(
        'Razorpay credentials are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.',
      );
    }
  }
}
