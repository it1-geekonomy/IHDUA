import { PartialType } from '@nestjs/swagger';
import { CreateImpactInitiativeStoryDto } from './create-impact-initiative-story.dto';

export class UpdateImpactInitiativeStoryDto extends PartialType(
  CreateImpactInitiativeStoryDto,
) {}

