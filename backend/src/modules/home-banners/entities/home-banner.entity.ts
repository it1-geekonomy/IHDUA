import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';

/**
 * Home Banners entity mapping to home_banners table
 */
@Entity('home_banners')
export class HomeBanner extends BaseEntity {
  @ApiProperty({
    example: 'Transforming Rural Communities',
    description: 'Title of the home banner',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiPropertyOptional({
    example: 'Karnataka, India',
    description: 'Location or project area related to the banner',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string | null;

  @ApiPropertyOptional({
    example: 'Empowering marginalized women and youth through skill-building.',
    description: 'Short description or tagline for the banner',
  })
  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription?: string | null;

  @ApiProperty({
    example:
      'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/home-banners/banner.jpg',
    description: 'Desktop / main banner image URL',
  })
  @Column({ name: 'banner_image_url', type: 'text' })
  bannerImageUrl: string;

  @ApiPropertyOptional({
    example:
      'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/home-banners/mobile-banner.jpg',
    description: 'Mobile-optimized banner image URL',
  })
  @Column({ name: 'mobile_banner_image_url', type: 'text', nullable: true })
  mobileBannerImageUrl?: string | null;

  @ApiProperty({
    example: 1,
    default: 1,
    description: 'Display order priority for ordering slides',
  })
  @Index('idx_home_banners_display_order')
  @Column({ name: 'display_order', type: 'integer', default: 1 })
  displayOrder: number;

  @ApiProperty({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
    description: 'Publication status',
  })
  @Index('idx_home_banners_status')
  @Column({
    type: 'enum',
    enum: ContentStatus,
    enumName: 'content_status',
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;
}
