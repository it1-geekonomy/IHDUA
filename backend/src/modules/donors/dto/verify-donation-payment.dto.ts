import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class VerifyDonationPaymentDto {
  @ApiProperty()
  @IsUUID()
  donorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  razorpayOrderId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  razorpaySignature: string;
}
