import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdatePasswordAuthDto } from './dto/update-password-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public/public.decorator';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @Post('refresh-token')
  @Public()
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
