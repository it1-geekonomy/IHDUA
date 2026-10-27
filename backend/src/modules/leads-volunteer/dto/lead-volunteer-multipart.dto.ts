import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateLeadVolunteerDto } from './create-lead-volunteer.dto';

/** Swagger-only shape so file pickers appear on multipart endpoints. */
export class CreateLeadVolunteerMultipartDto extends CreateLeadVolunteerDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Resume / CV file (PDF, DOC, DOCX, max 5MB)',
  })
  resume?: any;
}

export class UpdateLeadVolunteerMultipartDto extends PartialType(
  CreateLeadVolunteerMultipartDto,
) {}
