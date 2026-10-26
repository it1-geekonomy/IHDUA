import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DonationStatus } from '../../../common/enums/donation-status.enum';

@Entity('donors')
export class Donor extends BaseEntity {
  @ApiProperty({ example: 'Ramesh Kumar' })
  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @ApiProperty({ example: '+919876543210' })
  @Index('idx_donors_phone')
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @ApiProperty({ example: 'ramesh@example.com' })
  @Index('idx_donors_email')
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiPropertyOptional({ example: 'ABCDE1234F' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  pan: string | null;

  @ApiPropertyOptional({ example: '123, Green Road' })
  @Column({ type: 'text', nullable: true })
  address: string | null;

  @ApiPropertyOptional({ example: 'Karnataka' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string | null;

  @ApiPropertyOptional({ example: 'Bengaluru' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @ApiPropertyOptional({ example: '560001' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  pincode: string | null;

  @ApiPropertyOptional({ example: 'Supporting rural healthcare' })
  @Column({ type: 'text', nullable: true })
  message: string | null;

  @ApiProperty({ example: '5000.00' })
  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: string;

  @ApiProperty({ example: 'INR', default: 'INR' })
  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @ApiProperty({ example: 'General Donation', default: 'General Donation' })
  @Index('idx_donors_donation_category')
  @Column({
    name: 'donation_category',
    type: 'varchar',
    length: 100,
    default: 'General Donation',
  })
  donationCategory: string;

  @ApiPropertyOptional({ example: 'IHDUA-1730000000000' })
  @Column({ name: 'receipt_number', type: 'varchar', length: 50, nullable: true })
  receiptNumber: string | null;

  @ApiPropertyOptional({ example: 'pay_xyz123' })
  @Index('idx_donors_razorpay_payment_id')
  @Column({
    name: 'razorpay_payment_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  razorpayPaymentId: string | null;

  @ApiPropertyOptional({ example: 'order_abc456' })
  @Index('idx_donors_razorpay_order_id')
  @Column({
    name: 'razorpay_order_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  razorpayOrderId: string | null;

  @ApiProperty({ enum: DonationStatus, default: DonationStatus.PENDING })
  @Index('idx_donors_status')
  @Column({
    type: 'enum',
    enum: DonationStatus,
    enumName: 'donation_status',
    default: DonationStatus.PENDING,
  })
  status: DonationStatus;
}
