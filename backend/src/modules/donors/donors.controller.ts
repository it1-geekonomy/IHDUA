import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDonationOrderDto } from './dto/create-donation-order.dto';
import { VerifyDonationPaymentDto } from './dto/verify-donation-payment.dto';
import { DonorsService } from './donors.service';

@ApiTags('donors')
@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Post('create-order')
  @ApiOperation({ summary: 'Create a Razorpay order for a donation' })
  createOrder(@Body() dto: CreateDonationOrderDto) {
    return this.donorsService.createOrder(dto);
  }

  @Post('verify-payment')
  @ApiOperation({ summary: 'Verify Razorpay payment and mark donation success' })
  verifyPayment(@Body() dto: VerifyDonationPaymentDto) {
    return this.donorsService.verifyPayment(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all donations (admin)' })
  findAll() {
    return this.donorsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get donation by id (admin)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorsService.findOne(id);
  }
}
