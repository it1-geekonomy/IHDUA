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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiTagsConst } from '../../common/constants/api-tags';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateImpactInitiativeDto } from './dto/create-impact-initiative.dto';
import {
  CreateImpactInitiativeMultipartDto,
  UpdateImpactInitiativeMultipartDto,
} from './dto/impact-initiative-multipart.dto';
import { ImpactInitiativeQueryDto } from './dto/impact-initiative-query.dto';
import { UpdateImpactInitiativeDto } from './dto/update-impact-initiative.dto';
import { ImpactInitiative } from './entities/impact-initiative.entity';
import {
  ImpactInitiativeFiles,
  ImpactInitiativesService,
} from './impact-initiatives.service';

const IMAGE_FIELDS = FileFieldsInterceptor([
  { name: 'heroImage', maxCount: 1 },
  { name: 'heroImageMobile', maxCount: 1 },
]);

@ApiTags(ApiTagsConst.IMPACT_INITIATIVES)
@Controller('impact-initiatives')
export class ImpactInitiativesController {
  constructor(private readonly service: ImpactInitiativesService) {}

  @Public()
  @Get('public')
  @ApiOperation({
    summary: 'Get all published impact initiatives (Public Website)',
    description:
      'Returns published impact initiatives (list fields and category, no page content) ordered by display_order ASC. Use GET /impact-initiatives/slug/{slug} for a full page.',
  })
  @ApiOkResponse({
    description: 'List of published impact initiatives',
    type: [ImpactInitiative],
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
    summary: 'Get published impact initiative by unique slug (Public Website)',
    description: 'Returns published initiative details by slug.',
  })
  @ApiOkResponse({
    description: 'Impact initiative details',
    type: ImpactInitiative,
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateImpactInitiativeMultipartDto })
  @UseInterceptors(IMAGE_FIELDS)
  @ApiOperation({
    summary: 'Create new impact initiative (CMS Admin)',
    description:
      'Uploads the hero images (desktop and mobile) to Cloudflare R2 and creates the record. Requires Bearer token.',
  })
  @ApiCreatedResponse({
    description: 'Impact initiative created successfully',
    type: ImpactInitiative,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async create(
    @Body() dto: CreateImpactInitiativeDto,
    @UploadedFiles() files?: ImpactInitiativeFiles,
  ) {
    const data = await this.service.create(dto, files);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List recently deleted impact initiatives (CMS Trash)',
    description: 'Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Paginated trash list' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findDeleted(@Query() query: ImpactInitiativeQueryDto) {
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
    summary: 'List all impact initiatives with pagination & filters (CMS Admin)',
    description:
      'Supports pagination, search, category, status and deleted filters. Returns list fields only (no content or SEO); use GET /impact-initiatives/{id} for the full page. Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Paginated CMS list' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findAll(@Query() query: ImpactInitiativeQueryDto) {
    const result = await this.service.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get impact initiative by id (CMS Admin)' })
  @ApiOkResponse({ type: ImpactInitiative })
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
    summary: 'Restore soft-deleted impact initiative (CMS Admin)',
  })
  @ApiOkResponse({ type: ImpactInitiative })
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateImpactInitiativeMultipartDto })
  @UseInterceptors(IMAGE_FIELDS)
  @ApiOperation({
    summary: 'Update impact initiative (CMS Admin)',
    description:
      'Updates metadata. Uploaded images replace the old CDN images. Cannot move to a category with a different layout type.',
  })
  @ApiOkResponse({ type: ImpactInitiative })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateImpactInitiativeDto,
    @UploadedFiles() files?: ImpactInitiativeFiles,
  ) {
    const data = await this.service.update(id, dto, files);
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
    summary: 'Soft-delete impact initiative (CMS Admin)',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
    return {
      statusCode: HttpStatus.OK,
    };
  }}
