import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export const DONATION_FREQUENCIES = ['monthly', 'quarterly', 'yearly'] as const;
export type DonationFrequency = (typeof DONATION_FREQUENCIES)[number];

/** Razorpay subscription states, stored as Razorpay reports them. */
export const SUBSCRIPTION_STATUSES = [
  'created',
  'authenticated',
  'active',
  'pending',
  'halted',
  'paused',
  'cancelled',
  'completed',
  'expired',
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

/**
 * A recurring donation (Razorpay subscription). Every successful charge is
 * stored as its own row in `donors` with `subscription_id` pointing here.
 */
@Entity('donation_subscriptions')
export class DonationSubscription extends BaseEntity {
  @ApiProperty({ example: 'Ramesh Kumar' })
  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @ApiProperty({ example: '+919876543210' })
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @ApiProperty({ example: 'ramesh@example.com' })
  @Index('idx_donation_subscriptions_email')
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiPropertyOptional({ example: 'ABCDE1234F' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  pan: string | null;

  @ApiPropertyOptional({ example: '123, Green Road' })
  @Column({ type: 'text', nullable: true })
  address: string | null;

  @ApiPropertyOptional({ example: 'Bengaluru' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @ApiPropertyOptional({ example: 'Supporting rural healthcare' })
  @Column({ type: 'text', nullable: true })
  message: string | null;

  @ApiProperty({ example: 'General Donation' })
  @Column({
    name: 'donation_category',
    type: 'varchar',
    length: 100,
    default: 'General Donation',
  })
  donationCategory: string;

  @ApiProperty({ enum: DONATION_FREQUENCIES, example: 'monthly' })
  @Column({ type: 'varchar', length: 20 })
  frequency: DonationFrequency;

  @ApiProperty({
    example: '1000.00',
    description: 'Amount charged every cycle',
  })
  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: string;

  @ApiProperty({ example: 'INR' })
  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @ApiProperty({ example: 'plan_xxxxxxxxxxxx' })
  @Column({ name: 'razorpay_plan_id', type: 'varchar', length: 255 })
  razorpayPlanId: string;

  @ApiProperty({ example: 'sub_xxxxxxxxxxxx' })
  @Index('idx_donation_subscriptions_razorpay_id', { unique: true })
  @Column({ name: 'razorpay_subscription_id', type: 'varchar', length: 255 })
  razorpaySubscriptionId: string;

  @ApiProperty({ enum: SUBSCRIPTION_STATUSES, example: 'active' })
  @Index('idx_donation_subscriptions_status')
  @Column({ type: 'varchar', length: 20, default: 'created' })
  status: SubscriptionStatus;

  @ApiProperty({ example: 3, description: 'Successful charges so far' })
  @Column({ name: 'paid_count', type: 'int', default: 0 })
  paidCount: number;

  @ApiProperty({ example: 120, description: 'Maximum number of charges' })
  @Column({ name: 'total_count', type: 'int' })
  totalCount: number;

  @ApiPropertyOptional({ description: 'When the next charge is due' })
  @Column({ name: 'next_charge_at', type: 'timestamptz', nullable: true })
  nextChargeAt: Date | null;

  @ApiPropertyOptional()
  @Column({ name: 'ended_at', type: 'timestamptz', nullable: true })
  endedAt: Date | null;
}
