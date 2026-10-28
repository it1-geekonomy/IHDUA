import { PartialType } from '@nestjs/swagger';
import { CreateImpactStatDto } from './create-impact-stat.dto';

export class UpdateImpactStatDto extends PartialType(CreateImpactStatDto) {}
