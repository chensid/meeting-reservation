import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'refreshToken' })
  @IsNotEmpty({ message: 'refreshToken 不能为空' })
  @IsString({ message: 'refreshToken 必须为字符串' })
  refreshToken: string;
}
