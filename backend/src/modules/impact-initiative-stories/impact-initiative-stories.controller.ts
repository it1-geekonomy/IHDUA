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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CdnFile } from '../../common/storage/cdn.service';
import { CreateImpactInitiativeStoryDto } from './dto/create-impact-initiative-story.dto';
import {
  CreateImpactInitiativeStoryMultipartDto,
  UpdateImpactInitiativeStoryMultipartDto,
} from './dto/impact-initiative-story-multipart.dto';
import { ImpactInitiativeStoryQueryDto } from './dto/impact-initiative-story-query.dto';
import { UpdateImpactInitiativeStoryDto } from './dto/update-impact-initiative-story.dto';
import { ImpactInitiativeStory } from './entities/impact-initiative-story.entity';
import { ImpactInitiativeStoriesService } from './impact-initiative-stories.service';

@ApiTags(ApiTagsConst.IMPACT_INITIATIVE_STORIES)
@Controller('impact-initiative-stories')
export class ImpactInitiativeStoriesController {
  constructor(private readonly service: ImpactInitiativeStoriesService) {}

  @Public()
  @Get('initiative/:initiativeId')
  @ApiOperation({
    summary: 'Get all stories for an initiative (Public Website)',
    description:
      'Returns all active stories belonging to an initiative, sorted by display_order ASC.',
  })
  @ApiOkResponse({
    description: 'List of stories for initiative',
    type: [ImpactInitiativeStory],
  })
  async getByInitiative(@Param('initiativeId', ParseUUIDPipe) initiativeId: string) {
    const data = await this.service.findByInitiative(initiativeId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateImpactInitiativeStoryMultipartDto })
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Create new impact initiative story (CMS Admin)',
    description:
      'Uploads optional image file to Cloudflare R2 and creates the record. Requires Bearer token.',
  })
  @ApiCreatedResponse({
    description: 'Impact initiative story created successfully',
    type: ImpactInitiativeStory,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async create(
    @Body() dto: CreateImpactInitiativeStoryDto,
    @UploadedFile() file?: CdnFile,
  ) {
    const data = await this.service.create(dto, file);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List recently deleted impact initiative stories (CMS Trash)',
    description: 'Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Paginated trash list' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findDeleted(@Query() query: ImpactInitiativeStoryQueryDto) {
    const result = await this.service.findDeleted(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all impact initiative stories with pagination & filters (CMS Admin)',
    description:
      'Supports pagination, search, initiative filter, and deleted filter. Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Paginated CMS list' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async findAll(@Query() query: ImpactInitiativeStoryQueryDto) {
    const result = await this.service.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get impact initiative story by id (CMS Admin)' })
  @ApiOkResponse({ type: ImpactInitiativeStory })
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

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Restore soft-deleted impact initiative story (CMS Admin)',
  })
  @ApiOkResponse({ type: ImpactInitiativeStory })
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateImpactInitiativeStoryMultipartDto })
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Update impact initiative story (CMS Admin)',
    description:
      'Updates story metadata. If a new image is uploaded, old CDN image is deleted/replaced.',
  })
  @ApiOkResponse({ type: ImpactInitiativeStory })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired bearer token',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateImpactInitiativeStoryDto,
    @UploadedFile() file?: CdnFile,
  ) {
    const data = await this.service.update(id, dto, file);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete impact initiative story (CMS Admin)',
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

