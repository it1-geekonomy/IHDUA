import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { SeoFieldsDto } from '../../../common/dto/seo-fields.dto';
import { ContentStatus } from '../../../common/enums/content-status.enum';
import { parseJsonField } from '../../../common/utils/parse-json-field';

export class CreateImpactInitiativeDto extends OmitType(SeoFieldsDto, [
  'schemaCode',
] as const) {
  @ApiProperty({
    example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    description: 'Category UUID that this initiative belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    example: 'Adarsha Academy KRS',
    description: 'Name of the impact initiative (navbar label)',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: 'adarsha-academy-krs',
    description: 'URL-friendly unique slug',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  slug: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Display order for ordering initiatives within category',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  displayOrder?: number = 1;

  @ApiPropertyOptional({
    enum: ContentStatus,
    default: ContentStatus.PUBLISHED,
    example: ContentStatus.PUBLISHED,
    description: 'Publication status',
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus = ContentStatus.PUBLISHED;

  @ApiPropertyOptional({
    example: 'Adarsha Academy, KRS',
    description: 'Hero section title',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  heroTitle?: string;

  @ApiPropertyOptional({
    example: 'A rural school near the Krishnarajasagara Dam.',
    description: 'Hero section short description',
  })
  @IsOptional()
  @IsString()
  heroDescription?: string;

  @ApiPropertyOptional({
    example: 'Adarsha Academy KRS',
    description:
      'Title on the category landing page card. Leave empty to use name.',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  cardTitle?: string;

  @ApiPropertyOptional({
    type: 'string',
    description:
      'Page sections as a JSON string (multipart). Must match the category layout; see the content field on ImpactInitiative.',
    example:
      '{"intro":{"eyebrow":"EDUCATION","heading":"Adarsha Academy","highlights":[]},"statsStrip":null}',
  })
  @IsOptional()
  @Transform(({ value }) => parseJsonField(value))
  @IsObject({ message: 'content must be a valid JSON object' })
  content?: Record<string, unknown>;
}
