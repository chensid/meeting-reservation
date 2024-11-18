import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserBookingCountDto } from './dto/user-booking-count.dto';
import { MeetingRoomBookingCountDto } from './dto/meeting-room-booking-count.dto';

@ApiTags('statistic')
@ApiBearerAuth()
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('userBookingCount')
  @ApiOperation({ summary: '统计用户预订次数' })
  async userBookingCount(@Query() query: UserBookingCountDto) {
    const { startTime, endTime } = query;
    return this.statisticService.userBookingCount(startTime, endTime);
  }

  @Get('meetingRoomBookingCount')
  @ApiOperation({ summary: '统计会议室预订次数' })
  async meetingRoomBookingCount(@Query() query: MeetingRoomBookingCountDto) {
    const { startTime, endTime } = query;
    return this.statisticService.meetingRoomBookingCount(startTime, endTime);
  }
}
