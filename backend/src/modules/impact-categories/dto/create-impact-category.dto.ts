import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export class CreateImpactCategoryDto {
  @ApiProperty({
    example: 'Rural Development',
    description: 'Name of the impact category',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'rural-development',
    description: 'URL-friendly unique slug',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  slug: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Display order for ordering navigation categories',
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
}

