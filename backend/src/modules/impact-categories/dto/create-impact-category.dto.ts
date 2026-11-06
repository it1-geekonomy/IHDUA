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
import { ImpactLayoutType } from '../../../common/enums/impact-layout-type.enum';

export class CreateImpactCategoryDto {
  @ApiProperty({
    example: 'Education',
    description: 'Name of the impact category',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'education',
    description: 'URL-friendly unique slug',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  slug: string;

  @ApiProperty({
    enum: ImpactLayoutType,
    example: ImpactLayoutType.EDUCATION,
    description: 'Page template used by every initiative in this category',
  })
  @IsEnum(ImpactLayoutType)
  layoutType: ImpactLayoutType;

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
