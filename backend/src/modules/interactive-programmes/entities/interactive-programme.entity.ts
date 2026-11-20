import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';

/**
 * Interactive programmes / events shown on the public site (CMS-managed).
 * `event_media_url` holds either a banner image or video URL.
 */
@Entity('interactive_programmes')
export class InteractiveProgramme extends BaseEntity {
  @ApiProperty({ example: 'Rural Health Awareness Camp 2026' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ example: 'rural-health-awareness-camp-2026' })
  @Index('idx_interactive_programmes_slug', { unique: true })
  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/events/banner.webp',
    description: 'Event banner image or video URL',
  })
  @Column({ name: 'event_media_url', type: 'text', nullable: true })
  eventMediaUrl: string | null;

  @ApiPropertyOptional({ example: '2026-06-15', description: 'Event date' })
  @Column({ name: 'event_date', type: 'date', nullable: true })
  eventDate: string | null;

  @ApiPropertyOptional({ example: 'IHDUA Center, Mysore' })
  @Column({ name: 'event_location', type: 'varchar', length: 255, nullable: true })
  eventLocation: string | null;

  @ApiPropertyOptional({
    example: '10:00:00',
    description: 'Event starting time',
  })
  @Column({ name: 'event_time', type: 'time', nullable: true })
  eventTime: string | null;

  @ApiPropertyOptional({ description: 'Full event description / content' })
  @Column({ type: 'text', nullable: true })
  content: string | null;

  @ApiProperty({ enum: ContentStatus, default: ContentStatus.DRAFT })
  @Index('idx_interactive_programmes_status')
  @Column({
    type: 'enum',
    enum: ContentStatus,
    enumName: 'content_status',
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;
}
