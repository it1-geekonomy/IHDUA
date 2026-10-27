import { ApiPropertyOptional } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

/**
 * Base for page/content tables that support CMS SEO meta tags.
 * Not used by admin users.
 */
export abstract class SeoContentEntity extends BaseEntity {
  @ApiPropertyOptional({
    example: 'Page Title | IHDUA',
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

  @ApiPropertyOptional({
    example: 'code',
    description: 'Structured schema code (JSON-LD or other schema markup)',
    nullable: true,
  })
  @Column({ name: 'schema_code', type: 'text', nullable: true })
  schemaCode?: string | null;
}
