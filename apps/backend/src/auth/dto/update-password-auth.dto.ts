import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordAuthDto {
  @IsNotEmpty({ message: '密码不能为空' })
  @ApiProperty({ description: '旧密码' })
  oldPassword: string;

  @ApiProperty({ description: '新密码', minimum: 6, maximum: 50 })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: '新密码不能为空' })
  @MinLength(6, { message: '密码不能少于 6 位' })
  newPassword: string;
}
