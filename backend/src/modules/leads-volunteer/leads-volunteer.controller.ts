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
import { CreateLeadVolunteerDto } from './dto/create-lead-volunteer.dto';
import {
  CreateLeadVolunteerMultipartDto,
  UpdateLeadVolunteerMultipartDto,
} from './dto/lead-volunteer-multipart.dto';
import { UpdateLeadVolunteerDto } from './dto/update-lead-volunteer.dto';
import { LeadVolunteer } from './entities/lead-volunteer.entity';
import { LeadsVolunteerService } from './leads-volunteer.service';

@ApiTags(ApiTagsConst.LEADS_VOLUNTEER)
@Controller('leads-volunteer')
export class LeadsVolunteerController {
  constructor(private readonly service: LeadsVolunteerService) {}

  @Public()
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateLeadVolunteerMultipartDto })
  @UseInterceptors(FileInterceptor('resume'))
  @ApiOperation({
    summary: 'Submit volunteer inquiry (website)',
    description: 'Public endpoint for website volunteer modal submissions with resume upload.',
  })
  @ApiCreatedResponse({ type: LeadVolunteer })
  async create(
    @Body() dto: CreateLeadVolunteerDto,
    @UploadedFile() file?: CdnFile,
  ) {
    const data = await this.service.create(dto, file);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Volunteer inquiry submitted successfully',
      data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all volunteer leads (CMS)',
    description: 'Returns all volunteer leads. Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Paginated CMS list' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.service.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      message:
        result.meta.total === 0
          ? 'No volunteer inquiries found'
          : 'Volunteer inquiries fetched successfully',
      ...result,
    };
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List recently deleted volunteer leads (CMS trash)',
    description:
      'Soft-deleted leads only, newest first. Restore with POST /leads-volunteer/:id/restore.',
  })
  @ApiOkResponse({ description: 'Paginated trash list' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findDeleted(@Query() query: PaginationQueryDto) {
    const result = await this.service.findDeleted(query);
    return {
      statusCode: HttpStatus.OK,
      message:
        result.meta.total === 0
          ? 'No deleted volunteer inquiries found'
          : 'Deleted volunteer inquiries fetched successfully',
      ...result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get volunteer inquiry by id (CMS)' })
  @ApiOkResponse({ type: LeadVolunteer })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Volunteer inquiry fetched successfully',
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateLeadVolunteerMultipartDto })
  @UseInterceptors(FileInterceptor('resume'))
  @ApiOperation({ summary: 'Update volunteer inquiry (CMS)' })
  @ApiOkResponse({ type: LeadVolunteer })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadVolunteerDto,
    @UploadedFile() file?: CdnFile,
  ) {
    const data = await this.service.update(id, dto, file);
    return {
      statusCode: HttpStatus.OK,
      message: 'Volunteer inquiry updated successfully',
      data,
    };
  }

  @Post(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Restore soft-deleted volunteer inquiry (CMS)',
    description: 'Clears deletedAt so the inquiry shows again in the CMS inbox.',
  })
  @ApiOkResponse({ type: LeadVolunteer })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.restore(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Volunteer inquiry restored successfully',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete volunteer inquiry (CMS)',
    description: 'Sets deletedAt. Hidden from the CMS inbox.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Volunteer inquiry deleted successfully',
    };
  }
}
