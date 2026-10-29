import { PartialType } from '@nestjs/swagger';
import { CreateImpactCategoryDto } from './create-impact-category.dto';

export class UpdateImpactCategoryDto extends PartialType(
  CreateImpactCategoryDto,
) {}

