import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotSyncModule } from '../../common/chatbot-sync/chatbot-sync.module';
import { FundingProject } from './entities/funding-project.entity';
import { FundingProjectsController } from './funding-projects.controller';
import { FundingProjectsService } from './funding-projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([FundingProject]), ChatbotSyncModule],
  controllers: [FundingProjectsController],
  providers: [FundingProjectsService],
  exports: [FundingProjectsService],
})
export class FundingProjectsModule {}
