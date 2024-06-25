import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty({ description: '用户ID' })
  id: number;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '昵称' })
  nickname: string;

  @Exclude()
  password: string;

  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty({ description: '头像' })
  headPic: string;

  @ApiProperty({ description: '电话' })
  phoneNumber: string;

  @ApiProperty({ description: '是否冻结' })
  isFrozen: boolean;

  @Exclude()
  isAdmin: boolean;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  updateTime: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
