import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
  type RawBodyRequest,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiTagsConst } from '../../common/constants/api-tags';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateDonationOrderDto } from './dto/create-donation-order.dto';
import { VerifyDonationPaymentDto } from './dto/verify-donation-payment.dto';
import { DonationSubscriptionsService } from './donation-subscriptions.service';
import { DonorsService } from './donors.service';
import { Donor } from './entities/donor.entity';

@ApiTags(ApiTagsConst.DONORS)
@ApiExtraModels(Donor)
@Roles(UserRole.ADMIN)
@Controller('donors')
export class DonorsController {
  constructor(
    private readonly donorsService: DonorsService,
    private readonly subscriptions: DonationSubscriptionsService,
  ) {}

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

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Razorpay webhook receiver',
    description:
      'Handles subscription.* events for recurring donations (each subscription.charged becomes a paid donation). Verifies x-razorpay-signature with RAZORPAY_WEBHOOK_SECRET. Other events are acknowledged and ignored.',
  })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    const rawBody = req.rawBody ?? JSON.stringify(req.body);
    const { event, payload } = this.donorsService.parseRazorpayWebhook(
      rawBody,
      signature,
    );
    const data = event.startsWith('subscription.')
      ? await this.subscriptions.handleWebhook(event, payload)
      : { received: true, event, message: 'Event ignored' };
    return {
      statusCode: HttpStatus.OK,
      message: 'Webhook processed successfully',
      data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all donations (admin)' })
  @ApiOkResponse({
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: { type: 'array', items: { $ref: getSchemaPath(Donor) } },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Get donation by id (admin)',
    description:
      'Includes certificateUrl and receiptUrl (80G) once the donation PDFs have been stored.',
  })
  @ApiOkResponse({
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: { $ref: getSchemaPath(Donor) },
      },
    },
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.donorsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
