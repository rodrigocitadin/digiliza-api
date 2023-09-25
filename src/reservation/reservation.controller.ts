import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
    const reservation = await this.reservationService.create(createReservationDto);

    return reservation;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const reservation = await this.reservationService.findById(id);

    return reservation;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    const reservation = await this.reservationService.update(id, updateReservationDto);

    return reservation;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.reservationService.remove(id);
  }
}
