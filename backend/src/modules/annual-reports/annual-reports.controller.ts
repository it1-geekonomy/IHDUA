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
import {
  CreateAnnualReportMultipartDto,
  UpdateAnnualReportMultipartDto,
} from './dto/annual-report-multipart.dto';
import { AnnualReportQueryDto } from './dto/annual-report-query.dto';
import { CreateAnnualReportDto } from './dto/create-annual-report.dto';
import { UpdateAnnualReportDto } from './dto/update-annual-report.dto';
import { AnnualReport } from './entities/annual-report.entity';
import { AnnualReportsService } from './annual-reports.service';

@ApiTags(ApiTagsConst.ANNUAL_REPORTS)
@Controller('annual-reports')
export class AnnualReportsController {
  constructor(private readonly service: AnnualReportsService) {}

  @Public()
  @Get('published')
  @ApiOperation({
    summary: 'Get all published annual reports (Public Website)',
    description:
      'Returns all published annual reports sorted by sort_order ASC, report_year DESC, newest first.',
  })
  @ApiOkResponse({
    description: 'List of published annual reports',
    type: [AnnualReport],
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
    summary: 'List soft-deleted annual reports (CMS Trash)',
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
  @ApiBody({ type: CreateAnnualReportMultipartDto })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload and create annual report (CMS)',
    description:
      'Uploads report file to Cloudflare R2 and creates the record. Requires Bearer token.',
  })
  @ApiCreatedResponse({
    description: 'Created annual report',
    type: AnnualReport,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async create(
    @Body() dto: CreateAnnualReportDto,
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
    summary: 'List all annual reports with filtering (CMS)',
    description:
      'Supports pagination, search, status filter, and deleted filter. Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Paginated list of annual reports' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findAll(@Query() query: AnnualReportQueryDto) {
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
    summary: 'Get annual report by id (CMS)',
    description: 'Requires Bearer token.',
  })
  @ApiOkResponse({
    description: 'Annual report details',
    type: AnnualReport,
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
  @ApiBody({ type: UpdateAnnualReportMultipartDto })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Update annual report (CMS)',
    description:
      'Updates metadata. If a new file is uploaded, the old CDN file is automatically deleted and replaced.',
  })
  @ApiOkResponse({
    description: 'Updated annual report',
    type: AnnualReport,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAnnualReportDto,
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
    summary: 'Restore soft-deleted annual report (CMS)',
    description: 'Requires Bearer token.',
  })
  @ApiOkResponse({
    description: 'Restored annual report',
    type: AnnualReport,
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
    summary: 'Soft-delete annual report (CMS)',
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
