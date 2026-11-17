import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export type FundingComponentJson = {
  name: string;
  amountLabel: string;
  amountDigits?: string;
};

@Entity('funding_projects')
export class FundingProject extends BaseEntity {
  @ApiProperty({ example: 'school-essentials' })
  @Index('idx_funding_projects_slug', { unique: true })
  @Column({ type: 'varchar', length: 120 })
  slug: string;

  @ApiProperty({ example: '01' })
  @Column({ name: 'project_number', type: 'varchar', length: 10 })
  projectNumber: string;

  @ApiProperty({ example: 'School Essentials' })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({ example: 'Help provide one child with a full year of school essentials.' })
  @Column({ type: 'text' })
  summary: string;

  @ApiProperty({ example: '₹20,000 / child / year' })
  @Column({ name: 'total_label', type: 'varchar', length: 80 })
  totalLabel: string;

  @ApiProperty({
    example: 'School Essentials',
    description: 'donationCategory when donors give to this project (auto = title)',
  })
  @Column({ type: 'varchar', length: 120 })
  cause: string;

  @ApiPropertyOptional({ type: [String] })
  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  highlights: string[];

  @ApiProperty({ description: 'Component-wise funding breakup' })
  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  components: FundingComponentJson[];

  @ApiProperty({ example: 1 })
  @Index('idx_funding_projects_sort_order')
  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @ApiProperty({ enum: ContentStatus, default: ContentStatus.DRAFT })
  @Index('idx_funding_projects_status')
  @Column({
    type: 'enum',
    enum: ContentStatus,
    enumName: 'content_status',
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;
}
