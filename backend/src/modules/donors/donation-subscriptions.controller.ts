import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
} from '@nestjs/swagger';
import { ApiTagsConst } from '../../common/constants/api-tags';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DonationSubscriptionsService } from './donation-subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ListSubscriptionsQueryDto } from './dto/list-subscriptions-query.dto';
import { VerifySubscriptionDto } from './dto/verify-subscription.dto';
import { DonationSubscription } from './entities/donation-subscription.entity';

@ApiTags(ApiTagsConst.DONATION_SUBSCRIPTIONS)
@Roles(UserRole.ADMIN)
@Controller('donation-subscriptions')
export class DonationSubscriptionsController {
  constructor(private readonly service: DonationSubscriptionsService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Start a recurring donation (website)',
    description:
      'Monthly, quarterly or yearly, INR only. Creates a Razorpay subscription; the frontend opens Checkout with `keyId` + `subscriptionId`, then calls POST /donation-subscriptions/verify.',
  })
  @ApiCreatedResponse({ description: 'Razorpay checkout payload' })
  async create(@Body() dto: CreateSubscriptionDto) {
    const data = await this.service.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Recurring donation created successfully',
      data,
    };
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify recurring donation checkout (website)',
    description:
      'Call from the Razorpay Checkout success handler. Confirms the signature and, if the first charge was taken, records it as a paid donation.',
  })
  async verify(@Body() dto: VerifySubscriptionDto) {
    const data = await this.service.verify(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Recurring donation confirmed',
      data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List recurring donations (admin)' })
  @ApiOkResponse({ description: 'Paginated list' })
  async findAll(@Query() query: ListSubscriptionsQueryDto) {
    const result = await this.service.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      message:
        result.meta.total === 0
          ? 'No recurring donations found'
          : 'Recurring donations fetched successfully',
      ...result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get recurring donation with its charges (admin)' })
  @ApiOkResponse({ type: DonationSubscription })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const [subscription, charges] = await Promise.all([
      this.service.findOne(id),
      this.service.findCharges(id),
    ]);
    return {
      statusCode: HttpStatus.OK,
      message: 'Recurring donation fetched successfully',
      data: { ...subscription, charges },
    };
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel recurring donation now (admin)' })
  @ApiOkResponse({ type: DonationSubscription })
  async cancel(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.cancel(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Recurring donation cancelled',
      data,
    };
  }

  @Post(':id/pause')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pause recurring donation (admin)' })
  @ApiOkResponse({ type: DonationSubscription })
  async pause(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.pause(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Recurring donation paused',
      data,
    };
  }

  @Post(':id/resume')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resume a paused recurring donation (admin)' })
  @ApiOkResponse({ type: DonationSubscription })
  async resume(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.resume(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Recurring donation resumed',
      data,
    };
  }

  @Post(':id/sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh status from Razorpay (admin)' })
  @ApiOkResponse({ type: DonationSubscription })
  async sync(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.sync(id);
    return {
      statusCode: HttpStatus.OK,
      message: `Status synced: ${data.status}`,
      data,
    };
  }
}
