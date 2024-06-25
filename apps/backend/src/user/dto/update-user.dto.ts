import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: '头像', required: false })
  @IsOptional()
  headPic?: string;

  @ApiProperty({ description: '昵称' })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: '昵称不能为空' })
  nickname: string;
}
