import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { GetMeetingRoomsDto } from './dto/get-meeting-rooms.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MeetingRoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMeetingRoomDto: CreateMeetingRoomDto) {
    const foundMeetingRoom = await this.prismaService.meetingRoom.findFirst({
      where: { name: createMeetingRoomDto.name },
    });
    if (foundMeetingRoom) {
      throw new HttpException('会议室已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.prismaService.meetingRoom.create({
        data: createMeetingRoomDto,
      });
      return { message: '创建成功' };
    } catch {
      throw new HttpException('创建失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(query: GetMeetingRoomsDto) {
    const { name, capacity, equipment, page, limit } = query;
    const where = {
      ...(name && { name: { contains: name } }),
      ...(capacity && { capacity: { gte: capacity } }),
      ...(equipment && { equipment: { contains: equipment } }),
    };
    try {
      const [list, total] = await this.prismaService.$transaction([
        this.prismaService.meetingRoom.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where,
        }),
        this.prismaService.meetingRoom.count({ where }),
      ]);
      return { list, total };
    } catch {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    const foundMeetingRoom = await this.prismaService.meetingRoom.findUnique({
      where: { id },
    });
    if (!foundMeetingRoom) {
      throw new HttpException('会议室不存在', HttpStatus.BAD_REQUEST);
    }
    return foundMeetingRoom;
  }

  async update(updateMeetingRoomDto: UpdateMeetingRoomDto) {
    const { id } = updateMeetingRoomDto;
    const foundMeetingRoom = await this.prismaService.meetingRoom.findFirst({
      where: { id },
    });
    if (!foundMeetingRoom) {
      throw new HttpException('会议室不存在', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.prismaService.meetingRoom.update({
        where: { id },
        data: updateMeetingRoomDto,
      });
      return { message: '更新成功' };
    } catch {
      throw new HttpException('更新失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.meetingRoom.delete({ where: { id } });
      return { message: '删除成功' };
    } catch {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
