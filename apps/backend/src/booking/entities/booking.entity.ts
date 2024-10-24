import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '@prisma/client';

export class BookingEntity implements Booking {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '用户ID' })
  userId: string;

  @ApiProperty({ description: '房间ID' })
  roomId: string;

  @ApiProperty({ description: '开始时间' })
  startTime: Date;

  @ApiProperty({ description: '结束时间' })
  endTime: Date;

  @ApiProperty({
    description: '状态, 0: 申请中, 1: 申请通过, 2:申请失败  3: 已解除',
  })
  status: string;

  @ApiProperty({ description: '备注' })
  note: string;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  updateTime: Date;

  constructor(partial: Partial<BookingEntity>) {
    Object.assign(this, partial);
  }
}
