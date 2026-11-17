import { PartialType } from '@nestjs/swagger';
import { CreateFundingProjectDto } from './create-funding-project.dto';

export class UpdateFundingProjectDto extends PartialType(CreateFundingProjectDto) {}
