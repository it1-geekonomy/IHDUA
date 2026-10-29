import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';

/**
 * ImpactCategory entity mapping to impact_categories table (Main navigation categories)
 */
@Entity('impact_categories')
export class ImpactCategory extends BaseEntity {
  @ApiProperty({
    example: 'Rural Development',
    description: 'Name of the impact category',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    example: 'rural-development',
    description: 'URL-friendly unique slug for navigation',
    maxLength: 150,
  })
  @Column({ type: 'varchar', length: 150, unique: true })
  slug: string;

  @ApiProperty({
    example: 1,
    default: 1,
    description: 'Display order for ordering navigation categories',
  })
  @Index('idx_impact_categories_display_order')
  @Column({ name: 'display_order', type: 'integer', default: 1 })
  displayOrder: number;

  @ApiProperty({
    enum: ContentStatus,
    default: ContentStatus.PUBLISHED,
    example: ContentStatus.PUBLISHED,
    description: 'Publication status',
  })
  @Index('idx_impact_categories_status')
  @Column({
    type: 'enum',
    enum: ContentStatus,
    enumName: 'content_status',
    default: ContentStatus.PUBLISHED,
  })
  status: ContentStatus;
}

