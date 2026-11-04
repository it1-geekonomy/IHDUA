import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateImpactInitiativeStoryDto {
  @ApiProperty({
    example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    description: 'Initiative UUID that this story belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  initiativeId: string;

  @ApiProperty({
    example: 'Empowering Girls through Science Education',
    description: 'Title of the story',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'In rural Chitradurga, the science lab built under this initiative...',
    description: 'Detailed content / story text',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    example:
      'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/story-1.jpg',
    description: 'Public image URL (optional if uploading image file directly)',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Display order for ordering stories within an initiative',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  displayOrder?: number = 1;
}

