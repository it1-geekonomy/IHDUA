import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export class CreateHomeBannerMultipartDto {
  @ApiProperty({
    example: 'Transforming Rural Communities',
    description: 'Title of the home banner',
  })
  title: string;

  @ApiPropertyOptional({
    example: 'Karnataka, India',
    description: 'Location or project area related to the banner',
  })
  location?: string;

  @ApiPropertyOptional({
    example: 'Empowering marginalized women and youth through skill-building.',
    description: 'Short description or tagline for the banner',
  })
  shortDescription?: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Display order priority for ordering slides',
  })
  displayOrder?: number;

  @ApiPropertyOptional({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
  })
  status?: ContentStatus;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description:
      'Desktop / main banner image file (JPEG, PNG, WebP, AVIF max 5MB)',
  })
  bannerImage: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Mobile banner image file (JPEG, PNG, WebP, AVIF max 5MB)',
  })
  mobileBannerImage?: any;
}

export class UpdateHomeBannerMultipartDto {
  @ApiPropertyOptional({
    example: 'Transforming Rural Communities',
    description: 'Title of the home banner',
  })
  title?: string;

  @ApiPropertyOptional({
    example: 'Karnataka, India',
    description: 'Location or project area related to the banner',
  })
  location?: string;

  @ApiPropertyOptional({
    example: 'Empowering marginalized women and youth through skill-building.',
    description: 'Short description or tagline for the banner',
  })
  shortDescription?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display order priority for ordering slides',
  })
  displayOrder?: number;

  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.PUBLISHED,
  })
  status?: ContentStatus;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Optional replacement desktop banner image file (JPEG, PNG, WebP, AVIF max 5MB)',
  })
  bannerImage?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Optional replacement mobile banner image file (JPEG, PNG, WebP, AVIF max 5MB)',
  })
  mobileBannerImage?: any;
}
