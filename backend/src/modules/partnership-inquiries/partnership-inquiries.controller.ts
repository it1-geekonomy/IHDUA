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
import { CreatePartnershipInquiryDto } from './dto/create-partnership-inquiry.dto';
import { UpdatePartnershipInquiryDto } from './dto/update-partnership-inquiry.dto';
import { PartnershipInquiry } from './entities/partnership-inquiry.entity';
import { PartnershipInquiriesService } from './partnership-inquiries.service';

@ApiTags(ApiTagsConst.PARTNERSHIP_INQUIRIES)
@Controller('partnership-inquiries')
export class PartnershipInquiriesController {
  constructor(private readonly service: PartnershipInquiriesService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Submit partnership inquiry (website)',
    description: 'Public endpoint for website partnership modal submissions.',
  })
  @ApiCreatedResponse({ type: PartnershipInquiry })
  create(@Body() dto: CreatePartnershipInquiryDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all partnership inquiries (CMS)',
    description: 'Returns all partnership inquiries. Requires Bearer token.',
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
    summary: 'List recently deleted partnership inquiries (CMS trash)',
    description:
      'Soft-deleted inquiries only, newest first. Restore with POST /partnership-inquiries/:id/restore.',
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
  @ApiOperation({ summary: 'Get partnership inquiry by id (CMS)' })
  @ApiOkResponse({ type: PartnershipInquiry })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update partnership inquiry (CMS)' })
  @ApiOkResponse({ type: PartnershipInquiry })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePartnershipInquiryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Post(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Restore soft-deleted partnership inquiry (CMS)',
    description: 'Clears deletedAt so the inquiry shows again in the CMS inbox.',
  })
  @ApiOkResponse({ type: PartnershipInquiry })
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
    summary: 'Soft-delete partnership inquiry (CMS)',
    description: 'Sets deletedAt. Hidden from the CMS inbox.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
