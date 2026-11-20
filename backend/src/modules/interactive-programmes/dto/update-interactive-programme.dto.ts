import { PartialType } from '@nestjs/swagger';
import { CreateInteractiveProgrammeDto } from './create-interactive-programme.dto';

export class UpdateInteractiveProgrammeDto extends PartialType(
  CreateInteractiveProgrammeDto,
) {}
