import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { PartnershipInquiry } from './entities/partnership-inquiry.entity';
import { PartnershipInquiriesController } from './partnership-inquiries.controller';
import { PartnershipInquiriesService } from './partnership-inquiries.service';

@Module({
  imports: [TypeOrmModule.forFeature([PartnershipInquiry]), EmailModule],
  controllers: [PartnershipInquiriesController],
  providers: [PartnershipInquiriesService],
  exports: [PartnershipInquiriesService, TypeOrmModule],
})
export class PartnershipInquiriesModule {}

export { PartnershipInquiriesModule as LeadsPartnershipModule };
