import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export class CreateAnnualReportMultipartDto {
  @ApiProperty({
    example: 'Annual Report 2025-26',
    description: 'Report title',
  })
  title: string;

  @ApiProperty({
    example: '2025-2026',
    description: 'Report year',
  })
  reportYear: string;

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
    description: 'Annual report file (PDF)',
  })
  file: any;
}

export class UpdateAnnualReportMultipartDto {
  @ApiPropertyOptional({
    example: 'Updated Annual Report 2025-26',
    description: 'Report title',
  })
  title?: string;

  @ApiPropertyOptional({
    example: '2025-2026',
    description: 'Report year',
  })
  reportYear?: string;

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
    description: 'Optional replacement annual report file (PDF)',
  })
  file?: any;
}
