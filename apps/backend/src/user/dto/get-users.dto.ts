import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetUsersDto {
  @ApiProperty({ description: '用户名' })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  username?: string;

  @ApiProperty({ description: '昵称' })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  nickname?: string;

  @ApiProperty({ description: '邮箱' })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  email?: string;

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
