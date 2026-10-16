import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donor } from './donor.entity';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Donor])],
  controllers: [DonorsController],
  providers: [DonorsService],
  exports: [TypeOrmModule],
})
export class DonorsModule {}
