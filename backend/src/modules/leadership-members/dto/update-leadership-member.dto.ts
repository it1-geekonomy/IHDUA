import { PartialType } from '@nestjs/swagger';
import { CreateLeadershipMemberDto } from './create-leadership-member.dto';

export class UpdateLeadershipMemberDto extends PartialType(
  CreateLeadershipMemberDto,
) {}
