import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  Inject,
  HttpStatus,
  Query,
  Req,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { GetUsersDto } from './dto/get-users.dto';
import { Public } from 'src/common/decorators/public/public.decorator';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiOperation({ summary: '用户注册' })
  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto) {
    const captcha = await this.cacheManager.get(
      `captcha_${createUserDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (createUserDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.userService.findUserByEmail(
      createUserDto.email,
    );
    if (foundUser) {
      throw new HttpException('该用户已存在', HttpStatus.BAD_REQUEST);
    }
    return this.userService.register(createUserDto);
  }

  @ApiOperation({ summary: '获取所有用户' })
  @Get('list')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll(@Query() query: GetUsersDto) {
    return this.userService.findAll(query);
  }

  @ApiOperation({ summary: '获取单个用户' })
  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({ summary: '更新用户' })
  @Post('update')
  update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = request['user'];
    const id = user.id;
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: '冻结用户' })
  @Patch(':id/freeze')
  freeze(@Param('id') id: string) {
    return this.userService.freeze(+id);
  }

  @ApiOperation({ summary: '删除用户' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
