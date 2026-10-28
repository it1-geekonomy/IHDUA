import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export enum StorySortOrder {
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class QueryBlogAndStoryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    description: 'Filter blogs by category UUID',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    enum: StorySortOrder,
    default: StorySortOrder.NEWEST,
    example: StorySortOrder.NEWEST,
    description: 'Sort order: newest (Newest First) or oldest (Oldest First)',
  })
  @IsOptional()
  @IsIn(['newest', 'oldest', 'NEWEST', 'OLDEST'])
  sort?: string = StorySortOrder.NEWEST;
}
