import { users } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements users {
  @ApiProperty({ description: '用户ID' })
  id: number;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '昵称' })
  nickName: string;

  @Exclude()
  password: string;

  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty()
  headPic: string;

  @ApiProperty({ description: '电话' })
  phoneNumber: string;

  @Exclude()
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
