import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { SeoFieldsDto } from '../../../common/dto/seo-fields.dto';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export class CreateBlogAndStoryDto extends SeoFieldsDto {
  @ApiProperty({
    example: 'Transforming Rural Education in 2026',
    description: 'Title of the blog or story',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'transforming-rural-education-in-2026',
    description: 'URL-friendly slug',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    description: 'Associated category UUID',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({
    example: 'https://cdn.ihdua.org/blogs/banner.jpg',
    description: 'URL or path to blog banner image',
  })
  @IsOptional()
  @IsString()
  blogBanner?: string;

  @ApiPropertyOptional({
    example: '2026-10-27',
    description: 'Publication date of the blog (YYYY-MM-DD)',
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsDateString()
  blogDate?: string;

  @ApiPropertyOptional({
    example: '<p>Full content of the blog post...</p>',
    description: 'Full HTML or Markdown content',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: 'A brief summary of how education is changing rural lives.',
    description: 'Short excerpt or summary for cards and listings',
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.DRAFT,
    description: 'Publication status',
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
