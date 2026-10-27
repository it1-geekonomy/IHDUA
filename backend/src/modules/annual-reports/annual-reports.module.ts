import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnualReport } from './entities/annual-report.entity';
import { AnnualReportsController } from './annual-reports.controller';
import { AnnualReportsService } from './annual-reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnnualReport])],
  controllers: [AnnualReportsController],
  providers: [AnnualReportsService],
  exports: [TypeOrmModule, AnnualReportsService],
})
export class AnnualReportsModule {}
