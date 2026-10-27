import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';

/**
 * Milestones entity mapping to milestones table
 */
@Entity('milestones')
export class Milestone extends BaseEntity {
  @ApiProperty({ example: '1991', description: 'Year or time label of the milestone' })
  @Index('idx_milestones_year')
  @Column({ type: 'varchar', length: 10 })
  year: string;

  @ApiProperty({
    example: 'IHDUA established',
    description: 'Detailed description of the milestone achievement',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
    description: 'Publication status',
  })
  @Index('idx_milestones_status')
  @Column({
    type: 'enum',
    enum: ContentStatus,
    enumName: 'content_status',
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;
}
