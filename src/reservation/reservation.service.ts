import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { TableService } from 'src/table/table.service';

@Injectable()
export class ReservationService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private tableService: TableService
  ) { }

  async create(createReservationDto: CreateReservationDto) {
    await this.userService.findById(createReservationDto.user_id);
    await this.tableService.findById(createReservationDto.table_id);

    try {
      const reservation = await this.prisma.reservation.create({
        data: createReservationDto
      })

      return reservation;
    }
    catch (error) {
      throw new BadRequestException(error.name);
    }
  }

  async findAll() {
    const reservations = await this.prisma.reservation.findMany();

    return reservations;
  }

  async findById(id: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id }
    })

    if (!reservation) throw new NotFoundException("Reservation not found");

    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    await this.findById(id);

    try {
      const reservation = await this.prisma.reservation.update({
        where: { id },
        data: updateReservationDto
      })

      return reservation;
    }
    catch (error) {
      throw new BadRequestException(error.name);
    }
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.reservation.delete({ where: { id } });
  }
}