import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  SUPPORTED_DONATION_CURRENCIES,
  type DonationCurrencyCode,
} from './create-donation-order.dto';

export const OFFLINE_PAYMENT_MODES = [
  'cash',
  'cheque',
  'bank_transfer',
  'upi',
  'other',
] as const;

export type OfflinePaymentMode = (typeof OFFLINE_PAYMENT_MODES)[number];

/** Admin-created paid donation for offline / cash / bank donors. */
export class CreateManualDonationDto {
  @ApiProperty({ example: 'Priya Sharma' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ example: 'donor@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'Donation amount in major units',
    example: '5000',
  })
  @IsNumberString()
  @Matches(/^[1-9]\d*$/, { message: 'amount must be a positive whole number' })
  amount: string;

  @ApiPropertyOptional({
    example: 'INR',
    default: 'INR',
    enum: SUPPORTED_DONATION_CURRENCIES,
  })
  @IsOptional()
  @IsIn(SUPPORTED_DONATION_CURRENCIES)
  currency?: DonationCurrencyCode;

  @ApiPropertyOptional({
    example: 'IN',
    description:
      'Donor origin. Use IN for India (80G eligible with PAN). Any other code = foreign (certificate only, no 80G).',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  countryCode?: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  countryName?: string;

  @ApiPropertyOptional({
    example: 'School Essentials — Lunch bag or exam fees',
    description: 'Cause / funding project label shown on certificate & 80G',
  })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  donationCategory?: string;

  @ApiPropertyOptional({
    description: 'PAN or Aadhaar — required to generate the 80G receipt',
    example: 'ABCDE1234F',
  })
  @IsOptional()
  @ValidateIf(
    (_, value) => value !== undefined && value !== null && value !== '',
  )
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  pan?: string;

  @ApiPropertyOptional({ example: '123, Green Road' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Bengaluru' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'Collected at Mullur school event' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    enum: OFFLINE_PAYMENT_MODES,
    default: 'cash',
    example: 'cheque',
  })
  @IsOptional()
  @IsIn(OFFLINE_PAYMENT_MODES)
  paymentMode?: OfflinePaymentMode;

  @ApiPropertyOptional({
    description: 'Cheque no. / UTR / cash receipt reference',
    example: 'CHQ-4521',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  offlineReference?: string;

  @ApiPropertyOptional({
    description: 'Actual donation date (ISO). Defaults to now.',
    example: '2026-11-10',
  })
  @IsOptional()
  @IsDateString()
  donatedAt?: string;

  @ApiPropertyOptional({
    description:
      'When true, queue thank-you email with certificate (+ 80G when PAN is present). Default false.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  sendEmail?: boolean;
}
