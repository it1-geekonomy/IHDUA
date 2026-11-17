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
import { CreateFundingProjectDto } from './dto/create-funding-project.dto';
import { UpdateFundingProjectDto } from './dto/update-funding-project.dto';
import { FundingProject } from './entities/funding-project.entity';
import { FundingProjectsService } from './funding-projects.service';

@ApiTags(ApiTagsConst.FUNDING_PROJECTS)
@Controller('funding-projects')
export class FundingProjectsController {
  constructor(private readonly service: FundingProjectsService) {}

  @Public()
  @Get('published')
  @ApiOperation({
    summary: 'Published funding projects with donation breakups (public)',
  })
  @ApiOkResponse({ type: [FundingProject] })
  async findPublished() {
    const data = await this.service.findPublished();
    return { statusCode: HttpStatus.OK, data };
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create funding project (CMS)' })
  @ApiCreatedResponse({ type: FundingProject })
  @ApiUnauthorizedResponse()
  async create(@Body() dto: CreateFundingProjectDto) {
    const data = await this.service.create(dto);
    return { statusCode: HttpStatus.CREATED, data };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List funding projects (CMS table summary; no breakup JSON)',
  })
  @ApiUnauthorizedResponse()
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.service.findAll(query);
    return { statusCode: HttpStatus.OK, ...result };
  }

  @Get('deleted')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List soft-deleted funding projects (CMS trash summary)',
  })
  @ApiUnauthorizedResponse()
  async findDeleted(@Query() query: PaginationQueryDto) {
    const result = await this.service.findDeleted(query);
    return { statusCode: HttpStatus.OK, ...result };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get full funding project by id (CMS edit form)',
  })
  @ApiOkResponse({ type: FundingProject })
  @ApiUnauthorizedResponse()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.findOne(id);
    return { statusCode: HttpStatus.OK, data };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update funding project (CMS)' })
  @ApiOkResponse({ type: FundingProject })
  @ApiUnauthorizedResponse()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFundingProjectDto,
  ) {
    const data = await this.service.update(id, dto);
    return { statusCode: HttpStatus.OK, data };
  }

  @Patch(':id/restore')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore soft-deleted funding project (CMS)' })
  @ApiOkResponse({ type: FundingProject })
  @ApiUnauthorizedResponse()
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.restore(id);
    return { statusCode: HttpStatus.OK, data };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft-delete funding project (CMS)' })
  @ApiUnauthorizedResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
    return { statusCode: HttpStatus.OK };
  }
}
