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
    createReservationDto.date = new Date(createReservationDto.date);

    this.verifyTime(createReservationDto.date);

    const yearMonthDay = this.generateYearMonthDay(createReservationDto.date);

    const reservations = await this.verifyTables(
      createReservationDto.table_id,
      true,
      yearMonthDay
    );

    if (reservations.length) throw new BadRequestException("This table is currently unavailable");

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

    if (updateReservationDto.date) {
      this.verifyTime(updateReservationDto.date);
    }

    if (updateReservationDto.table_id) {
      if (!updateReservationDto.date) throw new BadRequestException("To change the table ID you need to provide a date");

      const ymd = this.generateYearMonthDay(updateReservationDto.date);
      const newTableAvailable = this.verifyTables(updateReservationDto.table_id, false, ymd);

      if (!newTableAvailable) throw new BadRequestException("This table is currently unavailable");
    }

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

  private verifyTime(date: Date) {
    const day = date.getDay();
    const hours = date.getHours();
    const startHours = 18;
    const finishHours = 23;

    const legalTime = hours >= startHours && hours <= finishHours;

    if (day === 0 || !legalTime) throw new BadRequestException("We are not open for new reservations")
  }

  private generateYearMonthDay(date: Date): string {
    const dayMonth = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month}-${dayMonth}`
  }

  async verifyTables(table_id: number, active: boolean, yearMonthDay: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        table_id: table_id,
        active: active,
        date: {
          lte: new Date(`${yearMonthDay}, 23:59:59`),
          gte: new Date(`${yearMonthDay}, 18:00:00`)
        }
      }
    })

    return reservations;
  }
}
