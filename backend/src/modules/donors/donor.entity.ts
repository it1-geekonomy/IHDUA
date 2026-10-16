import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DonationStatus } from './donation-status.enum';

@Entity('donors')
export class Donor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Index('idx_donors_phone')
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Index('idx_donors_email')
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  pan: string | null;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: string;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @Column({ name: 'receipt_number', type: 'varchar', length: 50, nullable: true })
  receiptNumber: string | null;

  @Index('idx_donors_razorpay_payment_id')
  @Column({
    name: 'razorpay_payment_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  razorpayPaymentId: string | null;

  @Index('idx_donors_razorpay_order_id')
  @Column({
    name: 'razorpay_order_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  razorpayOrderId: string | null;

  @Index('idx_donors_status')
  @Column({
    type: 'enum',
    enum: DonationStatus,
    enumName: 'donation_status',
    default: DonationStatus.PENDING,
  })
  status: DonationStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
