import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { plainToClass } from 'class-transformer';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private cryptoService: CryptoService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { username, nickName, password, email } = createUserDto;
    const user = await this.prismaService.user.create({
      data: {
        username,
        nickName,
        email,
        password: this.cryptoService.generateSHA256Hash(password),
      },
    });
    return plainToClass(UserEntity, user);
  }

  async findUserByEmail(email: string) {
    return await this.prismaService.user.findFirst({
      where: { email: email },
    });
  }

  findAll() {
    const userList = this.prismaService.user.findMany();
    return plainToClass(UserEntity, userList);
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    return plainToClass(UserEntity, user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
