import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CryptoService } from 'src/crypto/crypto.service';
import { plainToClass } from 'class-transformer';
import { AuthEntity } from './entities/auth.entity';
import { UpdatePasswordAuthDto } from './dto/update-password-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private cryptoService: CryptoService,
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
    return plainToClass(AuthEntity, user);
  }

  async logout() {
    return true;
  }

  async updatePassword(updatePasswordAuthDto: UpdatePasswordAuthDto) {
    console.log(updatePasswordAuthDto);
    return true;
  }

  async refreshToken() {
    return true;
  }
}
