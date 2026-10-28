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
  UseGuards,
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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UpdateNewsletterSubscriberDto } from './dto/update-newsletter-subscriber.dto';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';
import { NewsletterSubscribersService } from './newsletter-subscribers.service';

@ApiTags(ApiTagsConst.NEWSLETTER_SUBSCRIBERS)
@Controller('newsletter-subscribers')
export class NewsletterSubscribersController {
  constructor(private readonly service: NewsletterSubscribersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Subscribe to newsletter (website)',
    description: 'Public endpoint for website newsletter subscription.',
  })
  @ApiCreatedResponse({
    description: 'Subscribed successfully',
    type: NewsletterSubscriber,
  })
  async subscribe(@Body() dto: SubscribeNewsletterDto) {
    const result = await this.service.subscribe(dto);
    return {
      statusCode: HttpStatus.CREATED,
      data: result.subscriber,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all newsletter subscribers (CMS)',
    description: 'Returns all subscribers. Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Paginated CMS list' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.service.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get subscriber by ID (CMS)',
    description: 'Returns a single subscriber. Requires Bearer token.',
  })
  @ApiOkResponse({ type: NewsletterSubscriber })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update subscriber (CMS)',
    description: 'Updates subscriber details or active status. Requires Bearer token.',
  })
  @ApiOkResponse({ type: NewsletterSubscriber })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNewsletterSubscriberDto,
  ) {
    const data = await this.service.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete subscriber (CMS)',
    description: 'Moves subscriber to trash. Requires Bearer token.',
  })
  @ApiOkResponse({ description: 'Subscriber soft-deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
    return {
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Restore soft-deleted subscriber (CMS)',
    description: 'Restores a previously soft-deleted subscriber. Requires Bearer token.',
  })
  @ApiOkResponse({ type: NewsletterSubscriber })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.restore(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
