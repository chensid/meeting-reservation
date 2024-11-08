import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatisticService {
  constructor(private readonly prismaService: PrismaService) {}

  async userBookingCount(startTime: number, endTime: number) {
    try {
      const userBookingStats = await this.prismaService.user
        .findMany({
          select: {
            id: true,
            username: true,
            _count: {
              select: {
                bookings: {
                  where: {
                    startTime: { gte: new Date(startTime) },
                    endTime: { lte: new Date(endTime) },
                  },
                },
              },
            },
          },
        })
        .then((users) =>
          users.map((user) => ({
            id: user.id,
            username: user.username,
            bookingCount: user._count.bookings,
          })),
        );
      return { userBookingStats };
    } catch {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async meetingRoomBookingCount(startTime: number, endTime: number) {
    try {
      const meetingRoomBookingStats = await this.prismaService.meetingRoom
        .findMany({
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                bookings: {
                  where: {
                    startTime: { gte: new Date(startTime) },
                    endTime: { lte: new Date(endTime) },
                  },
                },
              },
            },
          },
        })
        .then((meetingRooms) =>
          meetingRooms.map((meetingRoom) => ({
            id: meetingRoom.id,
            name: meetingRoom.name,
            bookingCount: meetingRoom._count.bookings,
          })),
        );
      return { meetingRoomBookingStats };
    } catch {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
