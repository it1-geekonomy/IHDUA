import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../../common/storage/storage.module';
import { Donor } from './entities/donor.entity';
import { DonationDocumentsService } from './donation-documents.service';
import { DonationEmailQueueService } from './donation-email-queue.service';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Donor]), StorageModule],
  controllers: [DonorsController],
  providers: [DonorsService, DonationDocumentsService, DonationEmailQueueService],
  exports: [TypeOrmModule],
})
export class DonorsModule {}
