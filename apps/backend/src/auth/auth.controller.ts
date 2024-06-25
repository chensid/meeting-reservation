import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdatePasswordAuthDto } from './dto/update-password-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public/public.decorator';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EmailService } from 'src/email/email.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private emailService: EmailService,
  ) {}

  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  @Public()
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @ApiOperation({ summary: '用户登出' })
  @Post('logout')
  @ApiBearerAuth()
  async logout() {
    return this.authService.logout();
  }

  @ApiOperation({ summary: '验证码' })
  @Get('captcha')
  @Public()
  async captcha(@Query('address') address: string) {
    if (!address) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const captcha = await this.cacheManager.get(`captcha_${address}`);
    if (captcha) {
      throw new HttpException('请勿重复发送', HttpStatus.BAD_REQUEST);
    }
    const code = Math.random().toString().slice(2, 8);
    await this.cacheManager.set(`captcha_${address}`, code, 5 * 60 * 1000);
    await this.emailService.sendEmail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return { message: '验证码发送成功' };
  }

  @ApiOperation({ summary: '更新用户密码' })
  @Post('update-password')
  @ApiBearerAuth()
  async updatePassword(
    @Req() request: Request,
    @Body() updatePasswordAuthDto: UpdatePasswordAuthDto,
  ) {
    const user = request['user'];
    return this.authService.updatePassword(user.id, updatePasswordAuthDto);
  }

  @ApiOperation({ summary: '刷新用户令牌' })
  @Post('refresh')
  @Public()
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @ApiOperation({ summary: '找回密码' })
  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}
