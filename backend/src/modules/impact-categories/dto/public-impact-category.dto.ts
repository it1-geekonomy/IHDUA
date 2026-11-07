import { ApiProperty } from '@nestjs/swagger';
import { ImpactLayoutType } from '../../../common/enums/impact-layout-type.enum';
import { ImpactCategory } from '../entities/impact-category.entity';

/** Impact category as the public website sees it. */
export class PublicImpactCategoryDto {
  @ApiProperty({ example: 'Education' })
  name: string;

  @ApiProperty({ example: 'education', description: 'Website URL is /{slug}' })
  slug: string;

  @ApiProperty({ enum: ImpactLayoutType, example: ImpactLayoutType.EDUCATION })
  layoutType: ImpactLayoutType;

  @ApiProperty({ example: 1, description: 'Display order set in the CMS' })
  displayOrder: number;

  static from(category: ImpactCategory): PublicImpactCategoryDto {
    return {
      name: category.name,
      slug: category.slug,
      layoutType: category.layoutType,
      displayOrder: category.displayOrder,
    };
  }
}
