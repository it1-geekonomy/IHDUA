import { ApiProperty } from '@nestjs/swagger';
import { ImpactLayoutType } from '../../../common/enums/impact-layout-type.enum';

export class ImpactNavigationPageDto {
  @ApiProperty({ example: 'Vinayaka Jnana Vidyashale' })
  name: string;

  @ApiProperty({
    example: 'vinayakagnana-vidyashale-mysore',
    description: 'Website URL is /{slug}',
  })
  slug: string;
}

export class ImpactNavigationCategoryDto {
  @ApiProperty({ example: 'Education' })
  name: string;

  @ApiProperty({ example: 'education', description: 'Website URL is /{slug}' })
  slug: string;

  @ApiProperty({ enum: ImpactLayoutType, example: ImpactLayoutType.EDUCATION })
  layoutType: ImpactLayoutType;

  @ApiProperty({
    type: [ImpactNavigationPageDto],
    description: 'Published pages in display order; empty when none are published',
  })
  pages: ImpactNavigationPageDto[];
}
