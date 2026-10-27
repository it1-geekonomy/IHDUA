import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationalDocumentDto } from './create-organizational-document.dto';

export class UpdateOrganizationalDocumentDto extends PartialType(
  CreateOrganizationalDocumentDto,
) {}
