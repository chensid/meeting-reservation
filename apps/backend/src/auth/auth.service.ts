import {
  HttpException,
  HttpStatus,
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

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
}
