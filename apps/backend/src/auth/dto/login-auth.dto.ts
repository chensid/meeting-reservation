import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginAuthDto {
  @ApiProperty({ description: '用户名' })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '密码', minimum: 6, maximum: 50 })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
