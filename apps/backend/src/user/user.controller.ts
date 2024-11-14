import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
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
import { Request } from 'express';
import { GetUsersDto } from './dto/get-users.dto';
import { Public } from 'src/common/decorators/public/public.decorator';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '用户注册' })
  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @ApiOperation({ summary: '获取所有用户' })
  @Get('list')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll(@Query() query: GetUsersDto) {
    return this.userService.findAll(query);
  }

  @ApiOperation({ summary: '获取登录用户信息' })
  @Get('current')
  findLoginUser(@Req() request: Request) {
    const user = request['user'];
    const id = user.id;
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: '获取单个用户' })
  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: '更新用户' })
  @Post('update')
  update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = request['user'];
    const id = user.id;
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: '冻结用户' })
  @Patch(':id/freeze')
  freeze(@Param('id') id: string) {
    return this.userService.freeze(id);
  }

  @ApiOperation({ summary: '删除用户' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
