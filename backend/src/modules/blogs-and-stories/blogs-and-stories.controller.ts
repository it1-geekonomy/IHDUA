import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiTagsConst } from '../../common/constants/api-tags';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CdnFile } from '../../common/storage/cdn.service';
import { BlogsAndStoriesService } from './blogs-and-stories.service';
import {
  CreateBlogAndStoryMultipartDto,
  UpdateBlogAndStoryMultipartDto,
} from './dto/blog-and-story-multipart.dto';
import { CreateBlogAndStoryDto } from './dto/create-blog-and-story.dto';
import { QueryBlogAndStoryDto } from './dto/query-blog-and-story.dto';
import { UpdateBlogAndStoryDto } from './dto/update-blog-and-story.dto';
import { BlogAndStory } from './entities/blog-and-story.entity';

@ApiTags(ApiTagsConst.BLOGS_AND_STORIES)
@Controller('blogs-and-stories')
export class BlogsAndStoriesController {
  constructor(
    private readonly blogsAndStoriesService: BlogsAndStoriesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({ type: CreateBlogAndStoryMultipartDto })
  @UseInterceptors(FileInterceptor('blogBanner'))
  @ApiOperation({
    summary: 'Create blog or story (CMS / super-admin)',
    description:
      'Send multipart form fields plus optional image file `blogBanner`. CDN URL is stored on the row.',
  })
  @ApiCreatedResponse({ type: BlogAndStory })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  create(
    @Body() dto: CreateBlogAndStoryDto,
    @UploadedFile() file?: CdnFile,
  ) {
    return this.blogsAndStoriesService.create(dto, file);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all blogs and stories (CMS)',
    description:
      'Returns draft, published, and archived. Optional status/search/category filters. Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Paginated CMS list' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  findAll(@Query() query: QueryBlogAndStoryDto) {
    return this.blogsAndStoriesService.findAll(query);
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List recently deleted blogs and stories (CMS trash)',
    description:
      'Soft-deleted stories only, newest first. Restore with PATCH /blogs-and-stories/:id/restore.',
  })
  @ApiOkResponse({ description: 'Paginated trash list' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  findDeleted(@Query() query: QueryBlogAndStoryDto) {
    return this.blogsAndStoriesService.findDeleted(query);
  }

  @Public()
  @Get('published')
  @ApiOperation({
    summary: 'List published blogs and stories (website)',
    description: 'Public. Only status=published. No token required.',
  })
  @ApiOkResponse({ description: 'Paginated published list' })
  findPublished(@Query() query: QueryBlogAndStoryDto) {
    return this.blogsAndStoriesService.findPublished(query);
  }

  @Public()
  @Get(['published/slug/:slug', 'slug/:slug'])
  @ApiOperation({
    summary: 'Get published blog or story by slug with related stories (website)',
    description:
      'Public detail page. Use slug in the URL, returns story with related stories from the same category.',
  })
  @ApiOkResponse({ type: BlogAndStory })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of related items to return (default: 3)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for related items (default: 1)',
  })
  findPublishedBySlug(
    @Param('slug') slug: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    return this.blogsAndStoriesService.findPublishedBySlugWithRelated(
      slug,
      limit ? parseInt(limit, 10) : undefined,
      page ? parseInt(page, 10) : undefined,
    );
  }

  @Public()
  @Get(':id/related')
  @ApiOperation({
    summary: 'Get published blog or story by id with related stories (website)',
    description:
      'Public endpoint. Returns the story itself along with related stories belonging to the same category.',
  })
  @ApiOkResponse({ type: BlogAndStory })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of related items to return (default: 3)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for related items (default: 1)',
  })
  findRelated(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    return this.blogsAndStoriesService.findRelated(
      id,
      limit ? parseInt(limit, 10) : undefined,
      page ? parseInt(page, 10) : undefined,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get blog or story by id (CMS, any status)' })
  @ApiOkResponse({ type: BlogAndStory })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogsAndStoriesService.findOne(id);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Restore soft-deleted blog or story (CMS / super-admin)',
    description:
      'Clears deletedAt so the story shows again in CMS and on the website if published.',
  })
  @ApiOkResponse({ type: BlogAndStory })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogsAndStoriesService.restore(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({ type: UpdateBlogAndStoryMultipartDto })
  @UseInterceptors(FileInterceptor('blogBanner'))
  @ApiOperation({
    summary: 'Update blog or story (CMS / super-admin)',
    description:
      'Optional new `blogBanner` file replaces previous CDN object.',
  })
  @ApiOkResponse({ type: BlogAndStory })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBlogAndStoryDto,
    @UploadedFile() file?: CdnFile,
  ) {
    return this.blogsAndStoriesService.update(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete blog or story (CMS / super-admin)',
    description: 'Sets deletedAt. Hidden from CMS lists and the website.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogsAndStoriesService.remove(id);
  }
}
