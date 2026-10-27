import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';

/**
 * Leadership Members entity mapping to leadership_members table
 */
@Entity('leadership_members')
export class LeadershipMember extends BaseEntity {
  @ApiProperty({
    example: 'Dr. Jane Doe',
    description: 'Name of the leadership member',
    maxLength: 150,
  })
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ApiProperty({
    example: 'Managing Trustee',
    description: 'Designation / role of the leadership member',
    maxLength: 150,
  })
  @Column({ type: 'varchar', length: 150 })
  designation: string;

  @ApiProperty({
    example:
      'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/leadership-members/member-photo.jpg',
    description: 'Public CDN URL of the member photo',
  })
  @Column({ name: 'photo_url', type: 'text' })
  photoUrl: string;

  @ApiProperty({
    example: 0,
    default: 0,
    description: 'Sort order index for display priority',
  })
  @Index('idx_leadership_members_sort_order')
  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @ApiProperty({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
    description: 'Publication status',
  })
  @Index('idx_leadership_members_status')
  @Column({
    type: 'enum',
    enum: ContentStatus,
    enumName: 'content_status',
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;
}
