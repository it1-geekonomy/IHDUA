import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import Razorpay from 'razorpay';

export type RazorpaySubscriptionInfo = {
  id: string;
  plan_id: string;
  status: string;
  paid_count: number;
  total_count: number;
  /** Unix seconds; end of the current billing cycle, i.e. the next charge. */
  current_end?: number | null;
  charge_at?: number | null;
  ended_at?: number | null;
};

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

  async createPlan(params: {
    period: 'monthly' | 'yearly';
    interval: number;
    amountPaise: number;
    currency: string;
    name: string;
  }): Promise<string> {
    const plan = await this.getClient().plans.create({
      period: params.period,
      interval: params.interval,
      item: {
        name: params.name,
        amount: params.amountPaise,
        currency: params.currency,
      },
    });
    this.logger.log(`Razorpay plan created: ${plan.id}`);
    return String(plan.id);
  }

  async createSubscription(params: {
    planId: string;
    totalCount: number;
    /** Unix seconds; an unauthorised subscription expires after this. */
    expireBy?: number;
    notes?: Record<string, string>;
  }): Promise<RazorpaySubscriptionInfo> {
    const sub = await this.getClient().subscriptions.create({
      plan_id: params.planId,
      total_count: params.totalCount,
      quantity: 1,
      customer_notify: 1,
      ...(params.expireBy ? { expire_by: params.expireBy } : {}),
      notes: params.notes,
    });
    this.logger.log(`Razorpay subscription created: ${sub.id}`);
    return sub as unknown as RazorpaySubscriptionInfo;
  }

  async fetchSubscription(id: string): Promise<RazorpaySubscriptionInfo> {
    return (await this.getClient().subscriptions.fetch(
      id,
    )) as unknown as RazorpaySubscriptionInfo;
  }

  async cancelSubscription(id: string): Promise<RazorpaySubscriptionInfo> {
    return (await this.getClient().subscriptions.cancel(
      id,
      false,
    )) as unknown as RazorpaySubscriptionInfo;
  }

  async pauseSubscription(id: string): Promise<RazorpaySubscriptionInfo> {
    return (await this.getClient().subscriptions.pause(id, {
      pause_at: 'now',
    })) as unknown as RazorpaySubscriptionInfo;
  }

  async resumeSubscription(id: string): Promise<RazorpaySubscriptionInfo> {
    return (await this.getClient().subscriptions.resume(id, {
      resume_at: 'now',
    })) as unknown as RazorpaySubscriptionInfo;
  }

  /** Checkout signs subscription payments as `payment_id|subscription_id` (order payments use the reverse). */
  verifySubscriptionSignature(
    subscriptionId: string,
    paymentId: string,
    signature: string,
  ): boolean {
    this.assertConfigured();
    const expected = createHmac('sha256', this.keySecret)
      .update(`${paymentId}|${subscriptionId}`)
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
