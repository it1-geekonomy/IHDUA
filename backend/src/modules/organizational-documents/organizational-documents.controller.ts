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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiTagsConst } from '../../common/constants/api-tags';
import { Public } from '../../common/decorators/public.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CdnFile } from '../../common/storage/cdn.service';
import { CreateOrganizationalDocumentDto } from './dto/create-organizational-document.dto';
import {
  CreateOrganizationalDocumentMultipartDto,
  UpdateOrganizationalDocumentMultipartDto,
} from './dto/organizational-document-multipart.dto';
import { UpdateOrganizationalDocumentDto } from './dto/update-organizational-document.dto';
import { OrganizationalDocument } from './entities/organizational-document.entity';
import { OrganizationalDocumentsService } from './organizational-documents.service';

@ApiTags(ApiTagsConst.ORGANIZATIONAL_DOCUMENTS)
@Controller('organizational-documents')
export class OrganizationalDocumentsController {
  constructor(
    private readonly service: OrganizationalDocumentsService,
  ) {}

  @Public()
  @Get('published')
  @ApiOperation({
    summary: 'Get all published organizational documents (Public Website)',
    description:
      'Returns all published organizational documents sorted by sort_order ASC, newest first.',
  })
  @ApiOkResponse({
    description: 'List of published organizational documents',
    type: [OrganizationalDocument],
  })
  async findPublished() {
    const data = await this.service.findPublished();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List soft-deleted organizational documents (CMS Trash)',
    description: 'Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Paginated trash list' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findDeleted(@Query() query: PaginationQueryDto) {
    const result = await this.service.findDeleted(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateOrganizationalDocumentMultipartDto })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload and create organizational document (CMS)',
    description:
      'Uploads document file to Cloudflare R2 and creates the record. Requires Bearer token.',
  })
  @ApiCreatedResponse({
    description: 'Created organizational document',
    type: OrganizationalDocument,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async create(
    @Body() dto: CreateOrganizationalDocumentDto,
    @UploadedFile() file?: CdnFile,
  ) {
    const data = await this.service.create(dto, file);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all organizational documents with filtering (CMS)',
    description:
      'Supports pagination, search, status filter, and deleted filter. Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Paginated list of organizational documents' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.service.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get organizational document by id (CMS)',
    description: 'Requires Bearer token.',
  })
  @ApiOkResponse({
    description: 'Organizational document details',
    type: OrganizationalDocument,
  })
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateOrganizationalDocumentMultipartDto })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Update organizational document (CMS)',
    description:
      'Updates metadata. If a new file is uploaded, the old CDN file is automatically deleted and replaced.',
  })
  @ApiOkResponse({
    description: 'Updated organizational document',
    type: OrganizationalDocument,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationalDocumentDto,
    @UploadedFile() file?: CdnFile,
  ) {
    const data = await this.service.update(id, dto, file);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Restore soft-deleted organizational document (CMS)',
    description: 'Requires Bearer token.',
  })
  @ApiOkResponse({
    description: 'Restored organizational document',
    type: OrganizationalDocument,
  })
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete organizational document (CMS)',
    description: 'Requires Bearer token.',
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
