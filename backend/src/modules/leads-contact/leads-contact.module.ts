import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { LeadContact } from './entities/lead-contact.entity';
import { LeadsContactController } from './leads-contact.controller';
import { LeadsContactService } from './leads-contact.service';

@Module({
  imports: [TypeOrmModule.forFeature([LeadContact]), EmailModule],
  controllers: [LeadsContactController],
  providers: [LeadsContactService],
  exports: [LeadsContactService, TypeOrmModule],
})
export class LeadsContactModule {}
