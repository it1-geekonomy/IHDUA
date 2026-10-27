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
  async findPublished() {
    const data = await this.termsAndConditionsService.findPublished();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List soft-deleted terms and conditions (Admin)',
  })
  async findDeleted(@Query() query: PaginationQueryDto) {
    const result = await this.termsAndConditionsService.findDeleted(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
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
  async create(@Body() dto: CreateTermsAndConditionsDto) {
    const data = await this.termsAndConditionsService.create(dto);
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
      'List all terms and conditions with pagination and filtering (Admin)',
  })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.termsAndConditionsService.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
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
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.termsAndConditionsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
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
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.termsAndConditionsService.restore(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
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
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTermsAndConditionsDto,
  ) {
    const data = await this.termsAndConditionsService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete terms and conditions entry by id (Admin)',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.termsAndConditionsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
    };
  }
}
