import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetMeetingRoomsDto } from './dto/get-meeting-rooms.dto';
import { MeetingRoomEntity } from './entities/meeting-room.entity';

@ApiTags('meeting-room')
@ApiBearerAuth()
@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Post('create')
  @ApiOperation({ summary: '创建会议室' })
  create(@Body() createMeetingRoomDto: CreateMeetingRoomDto) {
    return this.meetingRoomService.create(createMeetingRoomDto);
  }

  @Get('list')
  @ApiOperation({ summary: '获取所有会议室' })
  @ApiOkResponse({ type: MeetingRoomEntity, isArray: true })
  findAll(@Query() query: GetMeetingRoomsDto) {
    return this.meetingRoomService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个会议室' })
  findOne(@Param('id') id: string) {
    return this.meetingRoomService.findOne(id);
  }

  @Patch('update')
  @ApiOperation({ summary: '更新会议室' })
  update(@Body() updateMeetingRoomDto: UpdateMeetingRoomDto) {
    return this.meetingRoomService.update(updateMeetingRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除会议室' })
  remove(@Param('id') id: string) {
    return this.meetingRoomService.remove(id);
  }
}
