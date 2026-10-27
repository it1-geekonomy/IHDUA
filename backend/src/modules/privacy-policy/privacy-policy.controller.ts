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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiTagsConst } from '../../common/constants/api-tags';
import { Public } from '../../common/decorators/public.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreatePrivacyPolicyDto } from './dto/create-privacy-policy.dto';
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto';
import { PrivacyPolicy } from './entities/privacy-policy.entity';
import { PrivacyPolicyService } from './privacy-policy.service';

@ApiTags(ApiTagsConst.PRIVACY_POLICY)
@Controller('privacy-policy')
export class PrivacyPolicyController {
  constructor(
    private readonly privacyPolicyService: PrivacyPolicyService,
  ) {}

  @Public()
  @Get('published')
  @ApiOperation({ summary: 'Get current published privacy policy (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Current published privacy policy',
    type: PrivacyPolicy,
  })
  async findPublished() {
    const data = await this.privacyPolicyService.findPublished();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List soft-deleted privacy policies (Admin)',
  })
  async findDeleted(@Query() query: PaginationQueryDto) {
    const result = await this.privacyPolicyService.findDeleted(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new privacy policy entry (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Privacy policy created successfully',
    type: PrivacyPolicy,
  })
  async create(@Body() dto: CreatePrivacyPolicyDto) {
    const data = await this.privacyPolicyService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'List all privacy policy entries with pagination and filtering (Admin)',
  })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.privacyPolicyService.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get privacy policy by id (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Privacy policy entry',
    type: PrivacyPolicy,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.privacyPolicyService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore soft-deleted privacy policy (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Restored privacy policy entry',
    type: PrivacyPolicy,
  })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.privacyPolicyService.restore(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update privacy policy entry by id (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Updated privacy policy entry',
    type: PrivacyPolicy,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePrivacyPolicyDto,
  ) {
    const data = await this.privacyPolicyService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft-delete privacy policy entry by id (Admin)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.privacyPolicyService.remove(id);
    return {
      statusCode: HttpStatus.OK,
    };
  }
}
