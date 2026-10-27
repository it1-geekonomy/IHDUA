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
  create(
    @Body() dto: CreateLeadVolunteerDto,
    @UploadedFile() file?: CdnFile,
  ) {
    return this.service.create(dto, file);
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
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
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
  findDeleted(@Query() query: PaginationQueryDto) {
    return this.service.findDeleted(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get volunteer inquiry by id (CMS)' })
  @ApiOkResponse({ type: LeadVolunteer })
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
  @ApiBody({ type: UpdateLeadVolunteerMultipartDto })
  @UseInterceptors(FileInterceptor('resume'))
  @ApiOperation({ summary: 'Update volunteer inquiry (CMS)' })
  @ApiOkResponse({ type: LeadVolunteer })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadVolunteerDto,
    @UploadedFile() file?: CdnFile,
  ) {
    return this.service.update(id, dto, file);
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
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.restore(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete volunteer inquiry (CMS)',
    description: 'Sets deletedAt. Hidden from the CMS inbox.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
