import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('statistic')
@ApiBearerAuth()
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('userBookingCount')
  @ApiOperation({ summary: '统计用户预订次数' })
  @ApiQuery({
    name: 'startTime',
    required: true,
    type: Number,
    description: '开始时间',
  })
  @ApiQuery({
    name: 'endTime',
    required: true,
    type: Number,
    description: '结束时间',
  })
  async userBookingCount(
    @Query('startTime') startTime: number,
    @Query('endTime') endTime: number,
  ) {
    return this.statisticService.userBookingCount(startTime, endTime);
  }

  @Get('meetingRoomBookingCount')
  @ApiOperation({ summary: '统计会议室预订次数' })
  @ApiQuery({
    name: 'startTime',
    required: true,
    type: Number,
    description: '开始时间',
  })
  @ApiQuery({
    name: 'endTime',
    required: true,
    type: Number,
    description: '结束时间',
  })
  async meetingRoomBookingCount(
    @Query('startTime') startTime: number,
    @Query('endTime') endTime: number,
  ) {
    return this.statisticService.meetingRoomBookingCount(startTime, endTime);
  }
}
