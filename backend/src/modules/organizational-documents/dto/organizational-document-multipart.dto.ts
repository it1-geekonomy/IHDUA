import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export class CreateOrganizationalDocumentMultipartDto {
  @ApiProperty({
    example: 'Trust Deed & Registration Certificate',
    description: 'Document title',
  })
  title: string;

  @ApiPropertyOptional({
    example: 0,
    default: 0,
    description: 'Sort order index',
  })
  sortOrder?: number;

  @ApiPropertyOptional({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
  })
  status?: ContentStatus;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Document file (PDF)',
  })
  file: any;
}

export class UpdateOrganizationalDocumentMultipartDto {
  @ApiPropertyOptional({
    example: 'Updated Trust Deed',
    description: 'Document title',
  })
  title?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Sort order index',
  })
  sortOrder?: number;

  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.PUBLISHED,
  })
  status?: ContentStatus;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Optional replacement document file (PDF)',
  })
  file?: any;
}
