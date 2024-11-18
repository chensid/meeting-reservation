import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import * as dayjs from 'dayjs';

export class UserBookingCountDto {
  @ApiProperty({
    description: '开始时间，默认为30天前',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  startTime?: number = dayjs().subtract(30, 'day').startOf('day').valueOf();

  @ApiProperty({
    description: '结束时间，默认为当前时间',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  endTime?: number = dayjs().endOf('day').valueOf();
}
