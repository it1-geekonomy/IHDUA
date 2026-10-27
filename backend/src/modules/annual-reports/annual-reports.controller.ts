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
  findPublished() {
    return this.service.findPublished();
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
  findDeleted(@Query() query: PaginationQueryDto) {
    return this.service.findDeleted(query);
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
  create(
    @Body() dto: CreateAnnualReportDto,
    @UploadedFile() file?: CdnFile,
  ) {
    return this.service.create(dto, file);
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
  findAll(@Query() query: AnnualReportQueryDto) {
    return this.service.findAll(query);
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
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
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
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAnnualReportDto,
    @UploadedFile() file?: CdnFile,
  ) {
    return this.service.update(id, dto, file);
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
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.restore(id);
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
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
