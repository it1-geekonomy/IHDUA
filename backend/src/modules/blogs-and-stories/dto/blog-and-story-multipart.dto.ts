import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateBlogAndStoryDto } from './create-blog-and-story.dto';

/** Swagger-only shape so file pickers appear on multipart endpoints. */
export class CreateBlogAndStoryMultipartDto extends OmitType(
  CreateBlogAndStoryDto,
  ['blogBanner'] as const,
) {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Desktop / web banner (WebP, AVIF, JPEG, PNG, max 5MB)',
  })
  blogBanner?: unknown;
}

export class UpdateBlogAndStoryMultipartDto extends PartialType(
  CreateBlogAndStoryMultipartDto,
) {}
