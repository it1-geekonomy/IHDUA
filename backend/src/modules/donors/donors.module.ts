import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../../common/storage/storage.module';
import { Donor } from './entities/donor.entity';
import { DonationSubscription } from './entities/donation-subscription.entity';
import { DonationDocumentsService } from './donation-documents.service';
import { DonationEmailQueueService } from './donation-email-queue.service';
import { DonationSubscriptionsController } from './donation-subscriptions.controller';
import { DonationSubscriptionsService } from './donation-subscriptions.service';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donor, DonationSubscription]),
    StorageModule,
  ],
  controllers: [DonorsController, DonationSubscriptionsController],
  providers: [
    DonorsService,
    DonationSubscriptionsService,
    DonationDocumentsService,
    DonationEmailQueueService,
  ],
  exports: [TypeOrmModule],
})
export class DonorsModule {}
