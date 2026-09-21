import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateDonationOrderDto {
  @ApiProperty({ example: 'Priya Sharma' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: 'donor@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: 'Donation amount in INR (rupees as digits, e.g. 1500)',
    example: '1500',
  })
  @IsNumberString()
  @Matches(/^[1-9]\d*$/, { message: 'amount must be a positive whole number' })
  amount: string;

  @ApiPropertyOptional({
    description: 'PAN or Aadhaar for 80G certificate',
    example: 'ABCDE1234F',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== undefined && value !== null && value !== '')
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  pan?: string;
}
