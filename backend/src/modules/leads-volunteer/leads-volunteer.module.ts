import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { LeadVolunteer } from './entities/lead-volunteer.entity';
import { LeadsVolunteerController } from './leads-volunteer.controller';
import { LeadsVolunteerService } from './leads-volunteer.service';

@Module({
  imports: [TypeOrmModule.forFeature([LeadVolunteer]), EmailModule],
  controllers: [LeadsVolunteerController],
  providers: [LeadsVolunteerService],
  exports: [LeadsVolunteerService, TypeOrmModule],
})
export class LeadsVolunteerModule {}
