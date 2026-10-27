import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiTagsConst } from '../../common/constants/api-tags';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';

@ApiTags(ApiTagsConst.AUTH)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Admin login — returns JWT' })
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Current authenticated admin user' })
  async me(@CurrentUser() user: AuthUser) {
    const data = await this.authService.me(user.id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
