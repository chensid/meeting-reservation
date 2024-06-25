import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CryptoService } from 'src/crypto/crypto.service';
import { UpdatePasswordAuthDto } from './dto/update-password-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async login(loginAuthDto: LoginAuthDto) {
    const { username, password } = loginAuthDto;
    const user = await this.prismaService.user.findFirst({
      where: {
        username,
        password: this.cryptoService.generateSHA256Hash(password),
      },
    });
    if (!user) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }
    const payload = {
      id: user.id,
      username: user.username,
      roles: [],
      permissions: [],
    };
    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });
    const refreshToken = await this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });
    return { accessToken, refreshToken };
  }

  async logout() {
    return true;
  }

  async updatePassword(
    userId: number,
    updatePasswordAuthDto: UpdatePasswordAuthDto,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const isPasswordValid = this.cryptoService.compareSHA256Hash(
      updatePasswordAuthDto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('旧密码错误', HttpStatus.BAD_REQUEST);
    }
    const hashedNewPassword = this.cryptoService.generateSHA256Hash(
      updatePasswordAuthDto.newPassword,
    );
    try {
      await this.prismaService.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });
      return '密码修改成功';
    } catch (error) {
      throw new HttpException('密码修改失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payloadInfo = this.jwtService.verify(refreshTokenDto.refreshToken);
      const payload = {
        id: payloadInfo.id,
        username: payloadInfo.username,
        roles: payloadInfo.roles,
        permissions: payloadInfo.permissions,
      };
      const accessToken = await this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRES_IN',
        ),
      });
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const findUser = await this.prismaService.user.findFirst({
      where: { email: forgotPasswordDto.email },
    });
    if (!findUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const captcha = await this.cacheManager.get(
      `captcha_${forgotPasswordDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (forgotPasswordDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = this.cryptoService.generateSHA256Hash(
      forgotPasswordDto.password,
    );
    try {
      await this.prismaService.user.update({
        where: { email: forgotPasswordDto.email },
        data: { password: hashedPassword },
      });
      await this.cacheManager.del(`captcha_${forgotPasswordDto.email}`);
      return { message: '密码重置成功' };
    } catch {
      throw new HttpException('密码重置失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
