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
  UploadedFiles,
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiTagsConst } from '../../common/constants/api-tags';
import { Public } from '../../common/decorators/public.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateInteractiveProgrammeDto } from './dto/create-interactive-programme.dto';
import {
  CreateInteractiveProgrammeMultipartDto,
  UpdateInteractiveProgrammeMultipartDto,
} from './dto/interactive-programme-multipart.dto';
import { UpdateInteractiveProgrammeDto } from './dto/update-interactive-programme.dto';
import { InteractiveProgramme } from './entities/interactive-programme.entity';
import {
  InteractiveProgrammeFiles,
  InteractiveProgrammesService,
} from './interactive-programmes.service';

@ApiTags(ApiTagsConst.INTERACTIVE_PROGRAMMES)
@Controller('interactive-programmes')
export class InteractiveProgrammesController {
  constructor(private readonly service: InteractiveProgrammesService) {}

  @Public()
  @Get('published')
  @ApiOperation({
    summary: 'Published interactive programmes (public list)',
    description:
      'Paginated card summary only (id, slug, title, media, date, location, time, status). Use GET /interactive-programmes/slug/:slug for full detail including content.',
  })
  @ApiOkResponse({ description: 'Paginated published programme cards' })
  async findPublished(@Query() query: PaginationQueryDto) {
    const result = await this.service.findPublished(query);
    return { statusCode: HttpStatus.OK, ...result };
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get published interactive programme by slug (public detail)',
    description:
      'Full programme including content, plus relatedEvents (other published programmes as card summaries).',
  })
  @ApiOkResponse({ type: InteractiveProgramme })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of related events to return (default: 3)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for related events (default: 1)',
  })
  async findPublishedBySlug(
    @Param('slug') slug: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const data = await this.service.findPublishedBySlug(
      slug,
      limit ? parseInt(limit, 10) : undefined,
      page ? parseInt(page, 10) : undefined,
    );
    return { statusCode: HttpStatus.OK, data };
  }

  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({ type: CreateInteractiveProgrammeMultipartDto })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'eventMedia', maxCount: 1 }]),
  )
  @ApiOperation({ summary: 'Create interactive programme (CMS)' })
  @ApiCreatedResponse({ type: InteractiveProgramme })
  @ApiUnauthorizedResponse()
  async create(
    @Body() dto: CreateInteractiveProgrammeDto,
    @UploadedFiles() files?: InteractiveProgrammeFiles,
  ) {
    const data = await this.service.create(dto, files);
    return { statusCode: HttpStatus.CREATED, data };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List interactive programmes (CMS)' })
  @ApiUnauthorizedResponse()
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.service.findAll(query);
    return { statusCode: HttpStatus.OK, ...result };
  }

  @Get('deleted')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List soft-deleted interactive programmes (CMS trash)' })
  @ApiUnauthorizedResponse()
  async findDeleted(@Query() query: PaginationQueryDto) {
    const result = await this.service.findDeleted(query);
    return { statusCode: HttpStatus.OK, ...result };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get interactive programme by id (CMS)' })
  @ApiOkResponse({ type: InteractiveProgramme })
  @ApiUnauthorizedResponse()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.findOne(id);
    return { statusCode: HttpStatus.OK, data };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({ type: UpdateInteractiveProgrammeMultipartDto })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'eventMedia', maxCount: 1 }]),
  )
  @ApiOperation({ summary: 'Update interactive programme (CMS)' })
  @ApiOkResponse({ type: InteractiveProgramme })
  @ApiUnauthorizedResponse()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInteractiveProgrammeDto,
    @UploadedFiles() files?: InteractiveProgrammeFiles,
  ) {
    const data = await this.service.update(id, dto, files);
    return { statusCode: HttpStatus.OK, data };
  }

  @Patch(':id/restore')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore soft-deleted interactive programme (CMS)' })
  @ApiOkResponse({ type: InteractiveProgramme })
  @ApiUnauthorizedResponse()
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.restore(id);
    return { statusCode: HttpStatus.OK, data };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft-delete interactive programme (CMS)' })
  @ApiUnauthorizedResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
    return { statusCode: HttpStatus.OK };
  }
}
