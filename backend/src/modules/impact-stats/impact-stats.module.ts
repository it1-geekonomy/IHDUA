import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImpactStat } from './entities/impact-stat.entity';
import { ImpactStatsController } from './impact-stats.controller';
import { ImpactStatsService } from './impact-stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImpactStat])],
  controllers: [ImpactStatsController],
  providers: [ImpactStatsService],
  exports: [ImpactStatsService, TypeOrmModule],
})
export class ImpactStatsModule {}
