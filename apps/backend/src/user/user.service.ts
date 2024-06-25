import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from './entities/user.entity';
import { GetUsersDto } from './dto/get-users.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private cryptoService: CryptoService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { username, nickname, password, email } = createUserDto;
    const user = await this.prismaService.user.create({
      data: {
        username,
        nickname,
        email,
        password: this.cryptoService.generateSHA256Hash(password),
      },
    });
    return plainToInstance(UserEntity, user);
  }

  async findUserByEmail(email: string) {
    return await this.prismaService.user.findFirst({
      where: { email: email },
    });
  }

  async findAll(query: GetUsersDto) {
    const { page, limit } = query;
    const [users, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.user.count(),
    ]);
    const list = plainToInstance(UserEntity, users);
    return { list, total };
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    return plainToInstance(UserEntity, user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });
      return plainToInstance(UserEntity, user);
    } catch {
      throw new HttpException('更新失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async freeze(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    try {
      const updateUser = await this.prismaService.user.update({
        where: { id },
        data: { isFrozen: true },
      });
      return plainToInstance(UserEntity, updateUser);
    } catch {
      throw new HttpException('冻结失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
