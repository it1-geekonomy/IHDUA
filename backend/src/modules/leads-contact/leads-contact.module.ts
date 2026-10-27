import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadContact } from './entities/lead-contact.entity';
import { LeadsContactController } from './leads-contact.controller';
import { LeadsContactService } from './leads-contact.service';

@Module({
  imports: [TypeOrmModule.forFeature([LeadContact])],
  controllers: [LeadsContactController],
  providers: [LeadsContactService],
  exports: [LeadsContactService, TypeOrmModule],
})
export class LeadsContactModule {}
