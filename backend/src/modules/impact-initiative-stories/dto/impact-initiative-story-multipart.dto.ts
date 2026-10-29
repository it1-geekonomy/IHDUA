import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateImpactInitiativeStoryMultipartDto {
  @ApiProperty({
    example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    description: 'Initiative UUID that this story belongs to',
  })
  initiativeId: string;

  @ApiProperty({
    example: 'Empowering Girls through Science Education',
    description: 'Title of the story',
  })
  title: string;

  @ApiProperty({
    example: 'In rural Chitradurga, the science lab built under this initiative...',
    description: 'Detailed content / story text',
  })
  content: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Display order for ordering stories within an initiative',
  })
  displayOrder?: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Story image file (JPEG, PNG, WebP, AVIF max 5MB)',
  })
  image: any;
}

export class UpdateImpactInitiativeStoryMultipartDto {
  @ApiPropertyOptional({
    example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    description: 'Initiative UUID that this story belongs to',
  })
  initiativeId?: string;

  @ApiPropertyOptional({
    example: 'Empowering Girls through Science Education',
    description: 'Title of the story',
  })
  title?: string;

  @ApiPropertyOptional({
    example: 'In rural Chitradurga, the science lab built under this initiative...',
    description: 'Detailed content / story text',
  })
  content?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display order for ordering stories within an initiative',
  })
  displayOrder?: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Optional replacement story image (JPEG, PNG, WebP, AVIF max 5MB)',
  })
  image?: any;
}
