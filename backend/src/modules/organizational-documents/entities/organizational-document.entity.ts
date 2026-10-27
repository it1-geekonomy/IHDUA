import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';

/**
 * Organizational Documents entity mapping to organizational_documents table
 */
@Entity('organizational_documents')
export class OrganizationalDocument extends BaseEntity {
  @ApiProperty({
    example: 'Trust Deed & Registration Certificate',
    description: 'Document title',
    maxLength: 200,
  })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({
    example:
      'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/organizational-documents/trust-deed.pdf',
    description: 'Public CDN URL of the uploaded document',
  })
  @Column({ name: 'file_url', type: 'text' })
  fileUrl: string;

  @ApiProperty({
    example: 0,
    default: 0,
    description: 'Sort order index for display priority',
  })
  @Index('idx_organizational_documents_sort_order')
  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @ApiProperty({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
    description: 'Publication status',
  })
  @Index('idx_organizational_documents_status')
  @Column({
    type: 'enum',
    enum: ContentStatus,
    enumName: 'content_status',
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;
}
