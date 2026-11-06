import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export class CreateImpactInitiativeDto {
  @ApiProperty({
    example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    description: 'Category UUID that this initiative belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    example: 'Adarsha School Project',
    description: 'Name of the impact initiative',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: 'adarsha-school-project',
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
}

