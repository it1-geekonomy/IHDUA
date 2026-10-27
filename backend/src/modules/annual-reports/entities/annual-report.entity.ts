import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';

/**
 * Annual Reports entity mapping to annual_reports table
 */
@Entity('annual_reports')
export class AnnualReport extends BaseEntity {
  @ApiProperty({
    example: 'Annual Report 2025-26',
    description: 'Annual report title',
    maxLength: 200,
  })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({
    example: '2025-2026',
    description: 'Financial / academic report year (e.g. 2025-2026 or 2025)',
    maxLength: 10,
  })
  @Column({ name: 'report_year', type: 'varchar', length: 10 })
  reportYear: string;

  @ApiProperty({
    example:
      'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/annual-reports/report-2025-26.pdf',
    description: 'Public CDN URL of the uploaded annual report',
  })
  @Column({ name: 'file_url', type: 'text' })
  fileUrl: string;

  @ApiProperty({
    example: 0,
    default: 0,
    description: 'Sort order index for display priority',
  })
  @Index('idx_annual_reports_sort_order')
  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @ApiProperty({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
    description: 'Publication status',
  })
  @Index('idx_annual_reports_status')
  @Column({
    type: 'enum',
    enum: ContentStatus,
    enumName: 'content_status',
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;
}
