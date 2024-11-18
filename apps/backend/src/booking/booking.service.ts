import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { GetBookingsDto } from './dto/get-bookings.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prismaService: PrismaService,
    private emailService: EmailService,
  ) {}

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
        status: { not: '3' },
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
    const { username, roomName, startTime, endTime, status, page, limit } =
      query;
    const where = {
      ...(username && { user: { username: { contains: username } } }),
      ...(roomName && { meetingRoom: { name: { contains: roomName } } }),
      ...(status && { status }),
      ...(startTime && { startTime: { gte: new Date(startTime) } }),
      ...(endTime && { endTime: { lte: new Date(endTime) } }),
    };

    try {
      const [list, total] = await this.prismaService.$transaction([
        this.prismaService.booking.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where,
          include: { user: true, meetingRoom: true },
        }),
        this.prismaService.booking.count({ where }),
      ]);
      return { list, total };
    } catch {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async approve(id: string) {
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
      return { message: '申请取消' };
    } catch {
      throw new HttpException('操作失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async history(query: GetBookingsDto, userId: string) {
    const { username, roomName, startTime, endTime, status, page, limit } =
      query;
    const where = {
      ...(userId && { user: { id: userId } }),
      ...(username && { user: { username: { contains: username } } }),
      ...(roomName && { meetingRoom: { name: { contains: roomName } } }),
      ...(status && { status }),
      ...(startTime && { startTime: { gte: new Date(startTime) } }),
      ...(endTime && { endTime: { lte: new Date(endTime) } }),
    };

    try {
      const [list, total] = await this.prismaService.$transaction([
        this.prismaService.booking.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where,
          include: { user: true, meetingRoom: true },
        }),
        this.prismaService.booking.count({ where }),
      ]);
      return { list, total };
    } catch {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async urge(id: string) {
    const admin = await this.prismaService.user.findFirstOrThrow({
      where: { isAdmin: true },
      select: { email: true },
    });
    try {
      await this.emailService.sendEmail({
        to: admin.email,
        subject: '预定申请催办提醒',
        html: `id 为 ${id} 的预定申请正在等待审批`,
      });
      return { message: '催办成功' };
    } catch {
      throw new HttpException('催办失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
