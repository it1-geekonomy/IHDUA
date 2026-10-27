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
import { CreateTermsAndConditionsDto } from './dto/create-terms-and-conditions.dto';
import { UpdateTermsAndConditionsDto } from './dto/update-terms-and-conditions.dto';
import { TermsAndConditions } from './entities/terms-and-conditions.entity';
import { TermsAndConditionsService } from './terms-and-conditions.service';

@ApiTags(ApiTagsConst.TERMS_AND_CONDITIONS)
@Controller('terms-and-conditions')
export class TermsAndConditionsController {
  constructor(
    private readonly termsAndConditionsService: TermsAndConditionsService,
  ) {}

  @Public()
  @Get('published')
  @ApiOperation({
    summary: 'Get current published terms and conditions (Public)',
  })
  @ApiResponse({
    status: 200,
    description: 'Current published terms and conditions',
    type: TermsAndConditions,
  })
  findPublished() {
    return this.termsAndConditionsService.findPublished();
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List soft-deleted terms and conditions (Admin)',
  })
  findDeleted(@Query() query: PaginationQueryDto) {
    return this.termsAndConditionsService.findDeleted(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new terms and conditions entry (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Terms and conditions created successfully',
    type: TermsAndConditions,
  })
  create(@Body() dto: CreateTermsAndConditionsDto) {
    return this.termsAndConditionsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'List all terms and conditions with pagination and filtering (Admin)',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.termsAndConditionsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get terms and conditions by id (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Terms and conditions entry',
    type: TermsAndConditions,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.termsAndConditionsService.findOne(id);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Restore soft-deleted terms and conditions (Admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Restored terms and conditions entry',
    type: TermsAndConditions,
  })
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.termsAndConditionsService.restore(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update terms and conditions entry by id (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Updated terms and conditions entry',
    type: TermsAndConditions,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTermsAndConditionsDto,
  ) {
    return this.termsAndConditionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete terms and conditions entry by id (Admin)',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.termsAndConditionsService.remove(id);
  }
}
