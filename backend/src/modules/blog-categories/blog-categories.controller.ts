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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiTagsConst } from '../../common/constants/api-tags';
import { Public } from '../../common/decorators/public.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BlogCategoriesService } from './blog-categories.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { BlogCategory } from './entities/blog-category.entity';

@ApiTags(ApiTagsConst.BLOG_CATEGORIES)
@Controller('blog-categories')
export class BlogCategoriesController {
  constructor(
    private readonly blogCategoriesService: BlogCategoriesService,
  ) {}

  @Public()
  @Get('published')
  @ApiOperation({ summary: 'Get all active blog categories (Public)' })
  @ApiResponse({
    status: 200,
    description: 'List of active blog categories',
    type: [BlogCategory],
  })
  findPublished() {
    return this.blogCategoriesService.findPublished();
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get blog category by slug (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Blog category details',
    type: BlogCategory,
  })
  findBySlug(@Param('slug') slug: string) {
    return this.blogCategoriesService.findBySlug(slug);
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List soft-deleted blog categories (Admin)' })
  findDeleted(@Query() query: PaginationQueryDto) {
    return this.blogCategoriesService.findDeleted(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new blog category (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Blog category created successfully',
    type: BlogCategory,
  })
  create(@Body() dto: CreateBlogCategoryDto) {
    return this.blogCategoriesService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all blog categories with pagination & filters (Admin)',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.blogCategoriesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get blog category by id (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Blog category details',
    type: BlogCategory,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogCategoriesService.findOne(id);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore soft-deleted blog category (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Restored blog category',
    type: BlogCategory,
  })
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogCategoriesService.restore(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog category by id (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Updated blog category',
    type: BlogCategory,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBlogCategoryDto,
  ) {
    return this.blogCategoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft-delete blog category by id (Admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogCategoriesService.remove(id);
  }
}
