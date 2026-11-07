import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateImpactInitiativeDto } from './create-impact-initiative.dto';

export class CreateImpactInitiativeMultipartDto extends CreateImpactInitiativeDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Hero image (desktop) file (JPEG, PNG, WebP, AVIF max 5MB)',
  })
  heroImage?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Hero image (mobile) file (JPEG, PNG, WebP, AVIF max 5MB)',
  })
  heroImageMobile?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Landing page card image file (JPEG, PNG, WebP, AVIF max 5MB). Falls back to the hero image when never set.',
  })
  cardImage?: any;
}

export class UpdateImpactInitiativeMultipartDto extends PartialType(
  CreateImpactInitiativeMultipartDto,
) {}
