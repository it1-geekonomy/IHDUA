import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImpactCategoriesController } from './impact-categories.controller';
import { ImpactCategoriesService } from './impact-categories.service';
import { ImpactCategory } from './entities/impact-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImpactCategory])],
  controllers: [ImpactCategoriesController],
  providers: [ImpactCategoriesService],
  exports: [ImpactCategoriesService],
})
export class ImpactCategoriesModule {}

