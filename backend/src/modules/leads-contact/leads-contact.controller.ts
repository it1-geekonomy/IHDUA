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
import { CreateLeadContactDto } from './dto/create-lead-contact.dto';
import { UpdateLeadContactDto } from './dto/update-lead-contact.dto';
import { LeadContact } from './entities/lead-contact.entity';
import { LeadsContactService } from './leads-contact.service';

@ApiTags(ApiTagsConst.LEADS_CONTACT)
@Controller('leads-contact')
export class LeadsContactController {
  constructor(private readonly service: LeadsContactService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Submit contact lead (website)',
    description: 'Public endpoint for website contact form submissions.',
  })
  @ApiCreatedResponse({ type: LeadContact })
  create(@Body() dto: CreateLeadContactDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all contact leads (CMS)',
    description: 'Returns all contact leads. Requires Bearer token.',
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
    summary: 'List recently deleted contact leads (CMS trash)',
    description:
      'Soft-deleted leads only, newest first. Restore with POST /leads-contact/:id/restore.',
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
  @ApiOperation({ summary: 'Get contact lead by id (CMS)' })
  @ApiOkResponse({ type: LeadContact })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update contact lead (CMS)' })
  @ApiOkResponse({ type: LeadContact })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadContactDto,
  ) {
    return this.service.update(id, dto);
  }

  @Post(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Restore soft-deleted contact lead (CMS)',
    description: 'Clears deletedAt so the lead shows again in the CMS inbox.',
  })
  @ApiOkResponse({ type: LeadContact })
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
    summary: 'Soft-delete contact lead (CMS)',
    description: 'Sets deletedAt. Hidden from the CMS inbox.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
