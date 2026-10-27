import { PartialType } from '@nestjs/swagger';
import { CreateLeadVolunteerDto } from './create-lead-volunteer.dto';

export class UpdateLeadVolunteerDto extends PartialType(CreateLeadVolunteerDto) {}

export { UpdateLeadVolunteerDto as UpdateLeadsVolunteerDto };
