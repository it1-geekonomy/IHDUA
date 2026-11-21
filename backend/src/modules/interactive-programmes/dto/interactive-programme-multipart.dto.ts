import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateInteractiveProgrammeDto } from './create-interactive-programme.dto';

export class CreateInteractiveProgrammeMultipartDto extends CreateInteractiveProgrammeDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Event banner image (JPEG/PNG/WebP/AVIF max 5MB) or video (MP4/WebM)',
  })
  eventMedia?: any;
}

export class UpdateInteractiveProgrammeMultipartDto extends PartialType(
  CreateInteractiveProgrammeMultipartDto,
) {}
