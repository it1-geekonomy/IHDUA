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
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { Milestone } from './entities/milestone.entity';
import { MilestonesService } from './milestones.service';

@ApiTags(ApiTagsConst.MILESTONES)
@Controller('milestones')
export class MilestonesController {
  constructor(private readonly service: MilestonesService) {}

  @Public()
  @Get('year-wise')
  @ApiOperation({
    summary: 'Get published milestones year-wise (Public Website)',
    description:
      'Returns all published milestones sorted in chronological order (by year ASC) for the Journey/Milestone timeline.',
  })
  @ApiOkResponse({
    description: 'Chronological list of published milestones',
    type: [Milestone],
  })
  getYearWise() {
    return this.service.findYearWise();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a milestone (CMS Admin)',
  })
  @ApiCreatedResponse({ type: Milestone })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  create(@Body() dto: CreateMilestoneDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all milestones (CMS Admin)',
    description: 'Paginated list with search, status filter, and sorting.',
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
    summary: 'List soft-deleted milestones (CMS trash)',
    description: 'Soft-deleted items only, newest first.',
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
  @ApiOperation({ summary: 'Get milestone by id (CMS Admin)' })
  @ApiOkResponse({ type: Milestone })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update milestone (CMS Admin)' })
  @ApiOkResponse({ type: Milestone })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMilestoneDto,
  ) {
    return this.service.update(id, dto);
  }

  @Post(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Restore soft-deleted milestone (CMS Admin)',
  })
  @ApiOkResponse({ type: Milestone })
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
    summary: 'Soft-delete milestone (CMS Admin)',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
