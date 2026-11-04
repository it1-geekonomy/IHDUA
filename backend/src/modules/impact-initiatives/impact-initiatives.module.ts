import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImpactCategory } from '../impact-categories/entities/impact-category.entity';
import { ImpactInitiative } from './entities/impact-initiative.entity';
import { ImpactInitiativesController } from './impact-initiatives.controller';
import { ImpactInitiativesService } from './impact-initiatives.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImpactInitiative, ImpactCategory])],
  controllers: [ImpactInitiativesController],
  providers: [ImpactInitiativesService],
  exports: [ImpactInitiativesService],
})
export class ImpactInitiativesModule {}

