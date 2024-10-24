import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { GetBookingsDto } from './dto/get-bookings.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, userId: string) {
    const { roomId, startTime, endTime, note } = createBookingDto;
    if (startTime >= endTime) {
      throw new HttpException(
        '开始时间必须小于结束时间',
        HttpStatus.BAD_REQUEST,
      );
    }
    const meetingRoom = await this.prismaService.meetingRoom.findUnique({
      where: { id: roomId },
    });
    if (!meetingRoom) {
      throw new HttpException('房间不存在', HttpStatus.BAD_REQUEST);
    }
    const overlappingMeetings = await this.prismaService.booking.findMany({
      where: {
        roomId,
        OR: [
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gt: new Date(startTime) },
          },
        ],
      },
    });
    if (overlappingMeetings.length > 0) {
      throw new HttpException('会议时间冲突', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.prismaService.booking.create({
        data: {
          userId,
          roomId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          note,
        },
      });
      return { message: '创建成功' };
    } catch {
      throw new HttpException('创建失败', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: GetBookingsDto) {
    const {
      username,
      roomName,
      roomPosition,
      startTime,
      endTime,
      page,
      limit,
    } = query;
    const where = {
      ...(username && { username: { contains: username } }),
      ...(roomName && { roomName: { contains: roomName } }),
      ...(roomPosition && { roomPosition: { contains: roomPosition } }),
      ...(startTime && { startTime: { gte: new Date(startTime) } }),
      ...(endTime && { endTime: { lte: new Date(endTime) } }),
    };
    try {
      const [bookings, total] = await this.prismaService.$transaction([
        this.prismaService.booking.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where,
        }),
        this.prismaService.booking.count({ where }),
      ]);
      return { bookings, total };
    } catch {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  async apply(id: string) {
    try {
      await this.prismaService.booking.update({
        where: { id },
        data: { status: '1' },
      });
      return { message: '申请通过' };
    } catch {
      throw new HttpException('操作失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async reject(id: string) {
    try {
      await this.prismaService.booking.update({
        where: { id },
        data: { status: '2' },
      });
      return { message: '申请拒绝' };
    } catch {
      throw new HttpException('操作失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async cancel(id: string) {
    try {
      await this.prismaService.booking.update({
        where: { id },
        data: { status: '3' },
      });
      return { message: '取消申请' };
    } catch {
      throw new HttpException('操作失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  update(id: string, updateBookingDto: UpdateBookingDto) {
    console.log(updateBookingDto);
    return `This action updates a #${id} booking`;
  }

  async remove(id: string) {
    try {
      await this.prismaService.booking.delete({
        where: { id },
      });
      return { message: '删除成功' };
    } catch {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
