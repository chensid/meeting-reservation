import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateMeetingRoomDto {
  @ApiProperty({ description: '会议室名称', maximum: 20 })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: '会议室名称不能为空' })
  @MaxLength(20, { message: '会议室名称不能超过20个字符' })
  name: string;

  @ApiProperty({ description: '会议室容量' })
  @IsNotEmpty({ message: '会议室容量不能为空' })
  capacity: number;

  @ApiProperty({ description: '会议室位置', maximum: 50 })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: '会议室位置不能为空' })
  @MaxLength(50, { message: '会议室位置不能超过50个字符' })
  location: string;

  @ApiProperty({ description: '会议室设备', maximum: 50 })
  @IsOptional()
  @MaxLength(50, { message: '会议室设备不能超过50个字符' })
  equipment: string;

  @ApiProperty({ description: '会议室描述', maximum: 100 })
  @IsOptional()
  @MaxLength(100, { message: '会议室描述不能超过100个字符' })
  description: string;
}
