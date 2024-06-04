import { users } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements users {
  @ApiProperty({ description: '用户ID' })
  id: number;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '昵称' })
  nick_name: string;

  @Exclude()
  password: string;

  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty()
  head_pic: string;

  @ApiProperty({ description: '电话' })
  phone_number: string;

  @Exclude()
  is_frozen: boolean;

  @Exclude()
  is_admin: boolean;

  @ApiProperty({ description: '创建时间' })
  create_time: Date;

  @ApiProperty({ description: '更新时间' })
  update_time: Date;
}
