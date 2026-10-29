import { PartialType } from '@nestjs/swagger';
import { CreateImpactInitiativeDto } from './create-impact-initiative.dto';

export class UpdateImpactInitiativeDto extends PartialType(
  CreateImpactInitiativeDto,
) {}

