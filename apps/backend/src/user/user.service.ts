import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { GetUsersDto } from './dto/get-users.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private cryptoService: CryptoService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const captcha = await this.cacheManager.get(
      `captcha_${createUserDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (createUserDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.prismaService.user.findFirst({
      where: { email: createUserDto.email },
    });
    if (foundUser) {
      throw new HttpException('该用户已存在', HttpStatus.BAD_REQUEST);
    }
    const { username, nickname, password, email } = createUserDto;
    try {
      await this.prismaService.user.create({
        data: {
          username,
          nickname,
          email,
          password: this.cryptoService.generateSHA256Hash(password),
        },
      });
      await this.cacheManager.del(`captcha_${email}`);
      return { message: '注册成功' };
    } catch {
      throw new HttpException('注册失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(query: GetUsersDto) {
    const { username, nickname, email, page, limit } = query;
    const where = {
      ...(username && { username: { contains: username } }),
      ...(nickname && { nickname: { contains: nickname } }),
      ...(email && { email: { contains: email } }),
    };
    try {
      const [list, total] = await this.prismaService.$transaction([
        this.prismaService.user.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where,
        }),
        this.prismaService.user.count({ where }),
      ]);
      return { list, total };
    } catch {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
      }
      return { user };
    } catch {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });
      return user;
    } catch {
      throw new HttpException('更新失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async freeze(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    try {
      await this.prismaService.user.update({
        where: { id },
        data: { isFrozen: true },
      });
      return { message: '冻结成功' };
    } catch {
      throw new HttpException('冻结失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
