import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import {
  DONATION_FREQUENCIES,
  type DonationFrequency,
} from '../entities/donation-subscription.entity';
import { CreateDonationOrderDto } from './create-donation-order.dto';

export class CreateSubscriptionDto extends CreateDonationOrderDto {
  @ApiProperty({ enum: DONATION_FREQUENCIES, example: 'monthly' })
  @IsIn([...DONATION_FREQUENCIES])
  frequency: DonationFrequency;
}
