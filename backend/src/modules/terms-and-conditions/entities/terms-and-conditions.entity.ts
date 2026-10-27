import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { SeoContentEntity } from '../../../common/entities/seo-content.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';

@Entity('terms_and_conditions')
export class TermsAndConditions extends SeoContentEntity {
  @ApiProperty({ example: 'Terms and Conditions' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({
    example: 'These terms and conditions govern your use of our services...',
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
  })
  @Index('idx_terms_and_conditions_status')
  @Column({
    type: 'enum',
    enum: ContentStatus,
    enumName: 'content_status',
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;
}
