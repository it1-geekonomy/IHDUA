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

export class CreateAnnualReportDto {
  @ApiProperty({
    example: 'Annual Report 2025-26',
    description: 'Annual report title',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: '2025-2026',
    description: 'Financial / academic report year (e.g. 2025-2026 or 2025)',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  reportYear: string;

  @ApiPropertyOptional({
    example: 0,
    default: 0,
    description: 'Sort order index for display priority',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number = 0;

  @ApiPropertyOptional({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
    description: 'Content publication status',
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus = ContentStatus.DRAFT;
}
