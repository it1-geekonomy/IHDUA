import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiTagsConst } from '../../common/constants/api-tags';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateDonationOrderDto } from './dto/create-donation-order.dto';
import { VerifyDonationPaymentDto } from './dto/verify-donation-payment.dto';
import { DonorsService } from './donors.service';

@ApiTags(ApiTagsConst.DONORS)
@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Public()
  @Post('create-order')
  @ApiOperation({ summary: 'Create a Razorpay order for a donation' })
  async createOrder(@Body() dto: CreateDonationOrderDto) {
    const data = await this.donorsService.createOrder(dto);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @Public()
  @Post('verify-payment')
  @ApiOperation({
    summary: 'Verify Razorpay payment and mark donation success',
  })
  async verifyPayment(@Body() dto: VerifyDonationPaymentDto) {
    const data = await this.donorsService.verifyPayment(dto);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all donations (admin)' })
  async findAll() {
    const data = await this.donorsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get donation by id (admin)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.donorsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
