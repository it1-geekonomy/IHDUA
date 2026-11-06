import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';
import { ImpactLayoutType } from '../../../common/enums/impact-layout-type.enum';
import { ImpactInitiative } from '../../impact-initiatives/entities/impact-initiative.entity';

/**
 * ImpactCategory entity mapping to impact_categories table (Main navigation categories)
 */
@Entity('impact_categories')
@Index('uq_impact_categories_slug', ['slug'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class ImpactCategory extends BaseEntity {
  @ApiProperty({
    example: 'Education',
    description: 'Name of the impact category',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    example: 'education',
    description: 'URL-friendly unique slug for navigation',
    maxLength: 150,
  })
  @Column({ type: 'varchar', length: 150 })
  slug: string;

  @ApiProperty({
    enum: ImpactLayoutType,
    example: ImpactLayoutType.EDUCATION,
    description:
      'Page template used by every initiative in this category. Cannot change once initiatives exist.',
  })
  @Column({
    name: 'layout_type',
    type: 'enum',
    enum: ImpactLayoutType,
    enumName: 'impact_layout_type',
  })
  layoutType: ImpactLayoutType;

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

  @OneToMany(() => ImpactInitiative, (initiative) => initiative.category)
  initiatives?: ImpactInitiative[];
}
