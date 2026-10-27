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
  findPublished() {
    return this.privacyPolicyService.findPublished();
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List soft-deleted privacy policies (Admin)',
  })
  findDeleted(@Query() query: PaginationQueryDto) {
    return this.privacyPolicyService.findDeleted(query);
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
  create(@Body() dto: CreatePrivacyPolicyDto) {
    return this.privacyPolicyService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'List all privacy policy entries with pagination and filtering (Admin)',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.privacyPolicyService.findAll(query);
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
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.privacyPolicyService.findOne(id);
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
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.privacyPolicyService.restore(id);
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
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePrivacyPolicyDto,
  ) {
    return this.privacyPolicyService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft-delete privacy policy entry by id (Admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.privacyPolicyService.remove(id);
  }
}
