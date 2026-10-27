import { PartialType } from '@nestjs/swagger';
import { CreateBlogAndStoryDto } from './create-blog-and-story.dto';

export class UpdateBlogAndStoryDto extends PartialType(CreateBlogAndStoryDto) {}
