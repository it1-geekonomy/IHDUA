import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
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

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: 'donor@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

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
