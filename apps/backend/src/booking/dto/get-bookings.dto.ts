import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class GetBookingsDto {
  @ApiProperty({ description: '预定人', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: '会议室名称', required: false })
  @IsOptional()
  @IsString()
  roomName?: string;

  @ApiProperty({ description: '开始时间', required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  startTime?: number;

  @ApiProperty({ description: '结束时间', required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  endTime?: number;

  @ApiProperty({ description: '预定状态', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(1000)
  limit?: number = 10;
}
