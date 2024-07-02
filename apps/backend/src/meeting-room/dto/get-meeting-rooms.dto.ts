import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetMeetingRoomsDto {
  @ApiProperty({ description: '会议室名称', required: false })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '会议室容量', required: false })
  @IsOptional()
  @Type(() => Number)
  capacity?: number;

  @ApiProperty({ description: '设备', required: false })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  equipment?: string;

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
