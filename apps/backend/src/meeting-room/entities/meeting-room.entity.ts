import { ApiProperty } from '@nestjs/swagger';
import { MeetingRoom } from '@prisma/client';

export class MeetingRoomEntity implements MeetingRoom {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: '会议室名称' })
  name: string;

  @ApiProperty({ description: '会议室容量' })
  capacity: number;

  @ApiProperty({ description: '会议室位置' })
  location: string;

  @ApiProperty({ description: '设备' })
  equipment: string;

  @ApiProperty({ description: '描述' })
  description: string;

  @ApiProperty({ description: '是否被预定' })
  isBooked: boolean;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  updateTime: Date;

  constructor(partial: Partial<MeetingRoomEntity>) {
    Object.assign(this, partial);
  }
}
