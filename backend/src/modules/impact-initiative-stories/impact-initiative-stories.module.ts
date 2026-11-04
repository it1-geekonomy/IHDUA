import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../../common/storage/storage.module';
import { ImpactInitiative } from '../impact-initiatives/entities/impact-initiative.entity';
import { ImpactInitiativeStory } from './entities/impact-initiative-story.entity';
import { ImpactInitiativeStoriesController } from './impact-initiative-stories.controller';
import { ImpactInitiativeStoriesService } from './impact-initiative-stories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImpactInitiativeStory, ImpactInitiative]),
    StorageModule,
  ],
  controllers: [ImpactInitiativeStoriesController],
  providers: [ImpactInitiativeStoriesService],
  exports: [ImpactInitiativeStoriesService],
})
export class ImpactInitiativeStoriesModule {}

