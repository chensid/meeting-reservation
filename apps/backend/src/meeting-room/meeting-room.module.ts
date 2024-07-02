import { Module } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { MeetingRoomController } from './meeting-room.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MeetingRoomController],
  providers: [MeetingRoomService],
  imports: [PrismaModule],
})
export class MeetingRoomModule {}
