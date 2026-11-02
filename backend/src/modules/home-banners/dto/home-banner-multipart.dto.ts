import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateHomeBannerDto } from './create-home-banner.dto';

export class CreateHomeBannerMultipartDto extends CreateHomeBannerDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description:
      'Desktop / main banner image file (JPEG, PNG, WebP, AVIF max 5MB)',
  })
  bannerImage: any;
}

export class UpdateHomeBannerMultipartDto extends PartialType(
  CreateHomeBannerMultipartDto,
) {}
