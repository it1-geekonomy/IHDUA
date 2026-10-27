import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { SeoContentEntity } from '../../../common/entities/seo-content.entity';
import { ContentStatus } from '../../../common/enums/content-status.enum';
import { BlogCategory } from '../../blog-categories/entities/blog-category.entity';

@Entity('blogs_and_stories')
export class BlogAndStory extends SeoContentEntity {
  @ApiPropertyOptional({
    example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    nullable: true,
  })
  @Index('idx_blogs_category_id')
  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null;

  @ApiProperty({ example: 'Transforming Rural Education in 2026' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ example: 'transforming-rural-education-in-2026' })
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @ApiPropertyOptional({
    example: 'https://cdn.ihdua.org/blogs/banner.jpg',
    nullable: true,
  })
  @Column({ name: 'blog_banner', type: 'text', nullable: true })
  blogBanner: string | null;

  @ApiPropertyOptional({ example: '2026-10-27', nullable: true })
  @Index('idx_blogs_blog_date')
  @Column({ name: 'blog_date', type: 'date', nullable: true })
  blogDate: string | null;

  @ApiPropertyOptional({
    example: '<p>Full content of the blog story...</p>',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  content: string | null;

  @ApiPropertyOptional({
    example: 'A brief summary of how education is changing rural lives.',
    nullable: true,
  })
  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription: string | null;

  @ApiProperty({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
  })
  @Index('idx_blogs_status')
  @Column({
    type: 'enum',
    enum: ContentStatus,
    enumName: 'content_status',
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @ManyToOne(() => BlogCategory, (category) => category.blogs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category?: BlogCategory | null;
}
