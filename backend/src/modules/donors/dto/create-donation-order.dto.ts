import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
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

import { DonationCategory } from '../../../common/enums/donation-category.enum';

export const SUPPORTED_DONATION_CURRENCIES = [
  'INR',
  'USD',
  'EUR',
  'GBP',
  'AED',
  'SGD',
  'AUD',
  'CAD',
] as const;

export type DonationCurrencyCode =
  (typeof SUPPORTED_DONATION_CURRENCIES)[number];

export class CreateDonationOrderDto {
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

  @ApiPropertyOptional({ example: 'IN' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  countryCode?: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  countryName?: string;

  @ApiPropertyOptional({ example: '123, Green Road' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ example: 'Bengaluru' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: '560001' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  pincode?: string;

  @ApiPropertyOptional({ example: 'Supporting rural healthcare' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    enum: DonationCategory,
    example: DonationCategory.GENERAL_DONATION,
    default: DonationCategory.GENERAL_DONATION,
  })
  @IsOptional()
  @IsEnum(DonationCategory)
  donationCategory?: DonationCategory;

  @ApiProperty({
    description: 'Donation amount in major units (e.g. 1500 INR or 25 USD)',
    example: '1500',
  })
  @IsNumberString()
  @Matches(/^[1-9]\d*$/, { message: 'amount must be a positive whole number' })
  amount: string;

  @ApiPropertyOptional({
    description: 'ISO currency code',
    example: 'INR',
    default: 'INR',
    enum: SUPPORTED_DONATION_CURRENCIES,
  })
  @IsOptional()
  @IsIn(SUPPORTED_DONATION_CURRENCIES)
  currency?: DonationCurrencyCode;

  @ApiPropertyOptional({
    description: 'PAN or Aadhaar for 80G certificate (India)',
    example: 'ABCDE1234F',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  pan?: string;
}
