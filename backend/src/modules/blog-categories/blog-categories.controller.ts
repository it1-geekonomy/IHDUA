import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
  async findPublished() {
    const data = await this.blogCategoriesService.findPublished();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get blog category by slug (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Blog category details',
    type: BlogCategory,
  })
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.blogCategoriesService.findBySlug(slug);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List soft-deleted blog categories (Admin)' })
  async findDeleted(@Query() query: PaginationQueryDto) {
    const result = await this.blogCategoriesService.findDeleted(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
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
  async create(@Body() dto: CreateBlogCategoryDto) {
    const data = await this.blogCategoriesService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all blog categories with pagination & filters (Admin)',
  })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.blogCategoriesService.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
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
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.blogCategoriesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
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
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.blogCategoriesService.restore(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
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
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBlogCategoryDto,
  ) {
    const data = await this.blogCategoriesService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft-delete blog category by id (Admin)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.blogCategoriesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
    };
  }
}
