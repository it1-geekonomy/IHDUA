import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';
import { ImpactCategory } from '../../impact-categories/entities/impact-category.entity';

/**
 * ImpactInitiative entity mapping to impact_initiatives table
 */
@Entity('impact_initiatives')
@Index('idx_impact_initiatives_category', ['categoryId', 'displayOrder'])
export class ImpactInitiative extends BaseEntity {
  @ApiProperty({
    example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    description: 'Associated impact category ID',
  })
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ApiProperty({
    example: 'Adarsha School Project',
    description: 'Name of the impact initiative',
    maxLength: 150,
  })
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ApiProperty({
    example: 'adarsha-school-project',
    description: 'URL-friendly unique slug for the initiative',
    maxLength: 200,
  })
  @Column({ type: 'varchar', length: 200, unique: true })
  slug: string;

  @ApiProperty({
    example: 1,
    default: 1,
    description: 'Display order for ordering initiatives within the category',
  })
  @Column({ name: 'display_order', type: 'integer', default: 1 })
  displayOrder: number;

  @ApiProperty({
    enum: ContentStatus,
    default: ContentStatus.PUBLISHED,
    example: ContentStatus.PUBLISHED,
    description: 'Publication status',
  })
  @Index('idx_impact_initiatives_status')
  @Column({
    type: 'enum',
    enum: ContentStatus,
    enumName: 'content_status',
    default: ContentStatus.PUBLISHED,
  })
  status: ContentStatus;

  @ManyToOne(() => ImpactCategory, (category) => category.initiatives, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category?: ImpactCategory;
}

