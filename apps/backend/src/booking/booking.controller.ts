import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GetBookingsDto } from './dto/get-bookings.dto';
import { BookingEntity } from './entities/booking.entity';
import { Request } from 'express';

@ApiTags('booking')
@ApiBearerAuth()
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('create')
  @ApiOperation({ summary: '创建预订' })
  create(@Body() createBookingDto: CreateBookingDto, @Req() request: Request) {
    const user = request['user'];
    const userId = user.id;
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get('list')
  @ApiOperation({ summary: '获取所有预订' })
  @ApiOkResponse({ type: BookingEntity, isArray: true })
  findAll(@Query() query: GetBookingsDto) {
    return this.bookingService.findAll(query);
  }

  @Patch('approve/:id')
  @ApiOperation({ summary: '批准预订' })
  approve(@Param('id') id: string) {
    return this.bookingService.approve(id);
  }

  @Patch('reject/:id')
  @ApiOperation({ summary: '拒绝预订' })
  reject(@Param('id') id: string) {
    return this.bookingService.reject(id);
  }

  @Patch('cancel/:id')
  @ApiOperation({ summary: '取消预订' })
  cancel(@Param('id') id: string) {
    return this.bookingService.cancel(id);
  }

  @Get('history')
  @ApiOperation({ summary: '预订历史' })
  history(@Query() query: GetBookingsDto, @Req() request: Request) {
    const user = request['user'];
    const userId = user.id;
    return this.bookingService.history(query, userId);
  }

  @Get('urge/:id')
  @ApiOperation({ summary: '催办预订' })
  urge(@Param('id') id: string) {
    return this.bookingService.urge(id);
  }
}
