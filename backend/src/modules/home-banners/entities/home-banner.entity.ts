import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';

/**
 * Home Banners entity mapping to home_banners table
 */
@Entity('home_banners')
export class HomeBanner extends BaseEntity {
  @ApiProperty({
    example:
      'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/home-banners/banner.jpg',
    description: 'Desktop / main banner image URL',
  })
  @Column({ name: 'banner_image_url', type: 'text' })
  bannerImageUrl: string;

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
