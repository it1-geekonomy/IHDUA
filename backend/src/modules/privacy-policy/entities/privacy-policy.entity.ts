import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { SeoContentEntity } from '../../../common/entities/seo-content.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';

@Entity('privacy_policy')
export class PrivacyPolicy extends SeoContentEntity {
  @ApiProperty({ example: 'Privacy Policy' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({
    example: 'This Privacy Policy explains how we collect and use your data...',
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
  })
  @Index('idx_privacy_policy_status')
  @Column({
    type: 'enum',
    enum: ContentStatus,
    enumName: 'content_status',
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;
}
