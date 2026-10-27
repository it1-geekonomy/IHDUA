import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SeoFieldsDto {
  @ApiPropertyOptional({
    example: 'Page Title | IHDUA',
    description: 'SEO Meta Title',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional({
    example: 'Page description for search engines and social sharing',
    description: 'SEO Meta Description',
  })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({
    example: 'code',
    description: 'Schema code (JSON-LD or other structured data script)',
  })
  @IsOptional()
  @IsString()
  schemaCode?: string;
}
