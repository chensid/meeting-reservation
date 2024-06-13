import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdatePasswordAuthDto } from './dto/update-password-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('logout')
  async logout() {
    return this.authService.logout();
  }

  @Post('password')
  async updatePassword(@Body() updatePasswordAuthDto: UpdatePasswordAuthDto) {
    return this.authService.updatePassword(updatePasswordAuthDto);
  }

  @Post('refreshToken')
  async refreshToken() {
    return this.authService.refreshToken();
  }
}
