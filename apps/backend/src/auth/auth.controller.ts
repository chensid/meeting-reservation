import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdatePasswordAuthDto } from './dto/update-password-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public/public.decorator';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('logout')
  @ApiBearerAuth()
  async logout() {
    return this.authService.logout();
  }

  @Post('update-password')
  @ApiBearerAuth()
  async updatePassword(
    @Req() request: Request,
    @Body() updatePasswordAuthDto: UpdatePasswordAuthDto,
  ) {
    const user = request['user'];
    return this.authService.updatePassword(user.id, updatePasswordAuthDto);
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
