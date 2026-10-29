import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiTagsConst } from '../../common/constants/api-tags';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateImpactCategoryDto } from './dto/create-impact-category.dto';
import { ImpactCategoryQueryDto } from './dto/impact-category-query.dto';
import { UpdateImpactCategoryDto } from './dto/update-impact-category.dto';
import { ImpactCategory } from './entities/impact-category.entity';
import { ImpactCategoriesService } from './impact-categories.service';

@ApiTags(ApiTagsConst.IMPACT_CATEGORIES)
@Controller('impact-categories')
export class ImpactCategoriesController {
  constructor(private readonly service: ImpactCategoriesService) {}

  @Public()
  @Get('public')
  @ApiOperation({
    summary: 'Get all published impact categories (Public Website Navigation)',
    description:
      'Returns all active and published impact categories ordered by display_order ASC for main website navigation.',
  })
  @ApiOkResponse({
    description: 'List of published impact categories',
    type: [ImpactCategory],
  })
  async getPublic() {
    const data = await this.service.findPublished();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get published impact category by slug (Public Website)',
    description: 'Returns published category metadata by unique slug.',
  })
  @ApiOkResponse({
    description: 'Impact category details',
    type: ImpactCategory,
  })
  async getBySlug(@Param('slug') slug: string) {
    const data = await this.service.findBySlug(slug);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new impact category (CMS Admin)',
  })
  @ApiCreatedResponse({
    description: 'Impact category created successfully',
    type: ImpactCategory,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async create(@Body() dto: CreateImpactCategoryDto) {
    const data = await this.service.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List recently deleted impact categories (CMS Trash)',
    description: 'Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Paginated trash list' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findDeleted(@Query() query: ImpactCategoryQueryDto) {
    const result = await this.service.findDeleted(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all impact categories with pagination & search (CMS Admin)',
    description:
      'Supports pagination, search, status filter, and deleted filter. Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Paginated CMS list' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findAll(@Query() query: ImpactCategoryQueryDto) {
    const result = await this.service.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get impact category by id (CMS Admin)' })
  @ApiOkResponse({ type: ImpactCategory })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Restore soft-deleted impact category (CMS Admin)',
  })
  @ApiOkResponse({ type: ImpactCategory })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.restore(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update impact category (CMS Admin)' })
  @ApiOkResponse({ type: ImpactCategory })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateImpactCategoryDto,
  ) {
    const data = await this.service.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete impact category (CMS Admin)',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
    return {
      statusCode: HttpStatus.OK,
    };
  }
}

