import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donor } from './entities/donor.entity';
import { DonationEmailQueueService } from './donation-email-queue.service';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Donor])],
  controllers: [DonorsController],
  providers: [DonorsService, DonationEmailQueueService],
  exports: [TypeOrmModule],
})
export class DonorsModule {}
