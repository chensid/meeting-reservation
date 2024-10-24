import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: '会议室id' })
  @IsNotEmpty()
  @Type(() => String)
  roomId: string;

  @ApiProperty({ description: '会议开始时间', example: 1720000402079 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  startTime: number;

  @ApiProperty({ description: '会议结束时间', example: 1720000402080 })
  @IsNotEmpty()
  @IsInt()
  endTime: number;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  note: string;
}
