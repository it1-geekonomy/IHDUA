import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundingProject } from './entities/funding-project.entity';
import { FundingProjectsController } from './funding-projects.controller';
import { FundingProjectsService } from './funding-projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([FundingProject])],
  controllers: [FundingProjectsController],
  providers: [FundingProjectsService],
  exports: [FundingProjectsService],
})
export class FundingProjectsModule {}
