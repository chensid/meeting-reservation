import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '昵称' })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: '昵称不能为空' })
  nickName: string;

  @ApiProperty({ description: '密码', minimum: 6, maximum: 50 })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码不能少于 6 位' })
  password: string;

  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '不是合法的邮箱格式' })
  email: string;

  @ApiProperty({ description: '验证码' })
  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
}
