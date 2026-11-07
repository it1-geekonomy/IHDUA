import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublicImpactCategoryDto } from '../../impact-categories/dto/public-impact-category.dto';
import { ImpactInitiative } from '../entities/impact-initiative.entity';

/** Published initiative in public lists (no page content). */
export class PublicImpactInitiativeListItemDto {
  @ApiProperty({ example: 'Adarsha Academy KRS' })
  name: string;

  @ApiProperty({
    example: 'adarsha-academy-krs',
    description: 'Website URL is /{slug}',
  })
  slug: string;

  @ApiPropertyOptional({ example: 'Adarsha Academy, KRS', nullable: true })
  heroTitle: string | null;

  @ApiPropertyOptional({ nullable: true })
  heroImageUrl: string | null;

  @ApiProperty({ type: PublicImpactCategoryDto })
  category: PublicImpactCategoryDto;

  static from(entity: ImpactInitiative): PublicImpactInitiativeListItemDto {
    return {
      name: entity.name,
      slug: entity.slug,
      heroTitle: entity.heroTitle ?? null,
      heroImageUrl: entity.heroImageUrl ?? null,
      category: PublicImpactCategoryDto.from(entity.category!),
    };
  }
}

/** Everything the website needs to render one initiative page. */
export class PublicImpactInitiativePageDto {
  @ApiProperty({ example: 'Adarsha Academy KRS' })
  name: string;

  @ApiProperty({ example: 'adarsha-academy-krs' })
  slug: string;

  @ApiPropertyOptional({ nullable: true })
  metaTitle: string | null;

  @ApiPropertyOptional({ nullable: true })
  metaDescription: string | null;

  @ApiPropertyOptional({ nullable: true })
  heroTitle: string | null;

  @ApiPropertyOptional({ nullable: true })
  heroDescription: string | null;

  @ApiPropertyOptional({ nullable: true })
  heroImageUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  heroImageMobileUrl: string | null;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
    description:
      'Page sections keyed by section name, shaped by category.layoutType. Optional sections are null when switched off.',
  })
  content: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true, example: '2026-11-07T04:21:54.837Z' })
  publishedAt: Date | null;

  @ApiProperty({ type: PublicImpactCategoryDto })
  category: PublicImpactCategoryDto;

  static from(entity: ImpactInitiative): PublicImpactInitiativePageDto {
    return {
      name: entity.name,
      slug: entity.slug,
      metaTitle: entity.metaTitle || null,
      metaDescription: entity.metaDescription || null,
      heroTitle: entity.heroTitle ?? null,
      heroDescription: entity.heroDescription ?? null,
      heroImageUrl: entity.heroImageUrl ?? null,
      heroImageMobileUrl: entity.heroImageMobileUrl ?? null,
      content: (entity.content as Record<string, unknown> | null) ?? null,
      publishedAt: entity.publishedAt ?? null,
      category: PublicImpactCategoryDto.from(entity.category!),
    };
  }
}
