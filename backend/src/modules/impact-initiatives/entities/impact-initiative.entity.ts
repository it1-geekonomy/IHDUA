import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';
import { ImpactCategory } from '../../impact-categories/entities/impact-category.entity';

/**
 * ImpactInitiative entity mapping to impact_initiatives table
 */
@Entity('impact_initiatives')
@Index('idx_impact_initiatives_category', ['categoryId', 'displayOrder'])
@Index('uq_impact_initiatives_slug', ['slug'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class ImpactInitiative extends BaseEntity {
  @ApiPropertyOptional({
    example: 'Adarsha Academy KRS | IHDUA',
    description: 'SEO Meta Title',
    nullable: true,
  })
  @Column({ name: 'meta_title', type: 'varchar', length: 255, nullable: true })
  metaTitle?: string | null;

  @ApiPropertyOptional({
    example: 'Page description for search engines and social sharing',
    description: 'SEO Meta Description',
    nullable: true,
  })
  @Column({ name: 'meta_description', type: 'text', nullable: true })
  metaDescription?: string | null;

  @ApiProperty({
    example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    description: 'Associated impact category ID',
  })
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ApiProperty({
    example: 'Adarsha Academy KRS',
    description: 'Name of the impact initiative (navbar label)',
    maxLength: 150,
  })
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ApiProperty({
    example: 'adarsha-academy-krs',
    description: 'URL-friendly unique slug for the initiative',
    maxLength: 200,
  })
  @Column({ type: 'varchar', length: 200 })
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

  @ApiPropertyOptional({
    example: '2026-11-04T10:00:00.000Z',
    description: 'First time the initiative was published',
    nullable: true,
  })
  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt?: Date | null;

  @ApiPropertyOptional({
    example: 'Adarsha Academy, KRS',
    description: 'Hero section title',
    nullable: true,
  })
  @Column({ name: 'hero_title', type: 'varchar', length: 255, nullable: true })
  heroTitle?: string | null;

  @ApiPropertyOptional({
    example: 'A rural school near the Krishnarajasagara Dam.',
    description: 'Hero section short description',
    nullable: true,
  })
  @Column({ name: 'hero_description', type: 'text', nullable: true })
  heroDescription?: string | null;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/impact-initiatives/hero.webp',
    description: 'Hero background image (desktop) CDN URL',
    nullable: true,
  })
  @Column({
    name: 'hero_image_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  heroImageUrl?: string | null;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/impact-initiatives/hero-mobile.webp',
    description: 'Hero background image (mobile) CDN URL',
    nullable: true,
  })
  @Column({
    name: 'hero_image_mobile_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  heroImageMobileUrl?: string | null;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
    description:
      "Page sections, keyed by section name. Which sections exist depends on the category's layoutType; optional sections are null when switched off.",
    example: {
      intro: {
        eyebrow: 'EDUCATION',
        heading: 'Adarsha Academy',
        description: 'A rural school near the Krishnarajasagara Dam.',
        highlights: [
          { iconUrl: 'https://cdn.example.com/website/mission.svg', heading: 'Mission', description: '…' },
        ],
      },
      statsStrip: null,
    },
  })
  @Column({ type: 'jsonb', nullable: true })
  content?: Record<string, unknown> | null;

  @ManyToOne(() => ImpactCategory, (category) => category.initiatives, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category?: ImpactCategory;
}
