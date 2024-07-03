import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch('apply/:id')
  apply(@Param('id') id: string) {
    return this.bookingService.apply(+id);
  }

  @Patch('accept/:id')
  reject(@Param('id') id: string) {
    return this.bookingService.reject(+id);
  }

  @Patch('cancel/:id')
  cancel(@Param('id') id: string) {
    return this.bookingService.cancel(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
