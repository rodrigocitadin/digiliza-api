import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { TableService } from 'src/table/table.service';
import { ReturnReservationDto } from './dto/return-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private tableService: TableService
  ) { }

  private returnReservation = {
    id: true,
    user_id: true,
    table_id: true,
    active: true,
    date: true
  }

  async create(createReservationDto: CreateReservationDto): Promise<ReturnReservationDto> {
    createReservationDto.date = new Date(createReservationDto.date);

    this.verifyTime(createReservationDto.date);

    const ymd = this.generateYearMonthDay(createReservationDto.date);

    const previousReservation = await this.verifyTables(createReservationDto.table_id, ymd);

    if (previousReservation) throw new BadRequestException("This table is currently unavailable");

    await this.userService.findById(createReservationDto.user_id);
    await this.tableService.findById(createReservationDto.table_id);

    try {
      const reservation = await this.prisma.reservation.create({
        data: createReservationDto,
        select: this.returnReservation
      })

      return reservation;
    }
    catch (error) {
      throw new BadRequestException(error.name);
    }
  }

  async findAll(): Promise<ReturnReservationDto[]> {
    const reservations = await this.prisma.reservation.findMany({
      select: this.returnReservation
    });

    return reservations;
  }

  async findById(id: string): Promise<ReturnReservationDto> {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id },
      select: this.returnReservation
    })

    if (!reservation) throw new NotFoundException("Reservation not found");

    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto): Promise<ReturnReservationDto> {
    const previousReservation = await this.findById(id);

    if (updateReservationDto.date) {
      updateReservationDto.date = new Date(updateReservationDto.date)
      this.verifyTime(updateReservationDto.date);
    }

    if (updateReservationDto.table_id) {
      if (!updateReservationDto.date) updateReservationDto.date = previousReservation.date;

      const ymd = this.generateYearMonthDay(updateReservationDto.date);
      const tableUnavailable = await this.verifyTables(updateReservationDto.table_id, ymd);

      if (tableUnavailable) throw new BadRequestException("This table is currently unavailable");
    }

    try {
      const reservation = await this.prisma.reservation.update({
        where: { id },
        data: updateReservationDto,
        select: this.returnReservation
      })

      return reservation;
    }
    catch (error) {
      throw new BadRequestException(error.name);
    }
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.reservation.delete({ where: { id } });
  }

  private verifyTime(date: Date): void {
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

  async verifyTables(table_id: number, yearMonthDay: string): Promise<ReturnReservationDto | void> {
    const reservations = await this.prisma.reservation.findFirst({
      where: {
        table_id: table_id,
        active: true,
        date: {
          lte: new Date(`${yearMonthDay}, 23:59:59`),
          gte: new Date(`${yearMonthDay}, 18:00:00`)
        }
      }
    })

    return reservations;
  }
}
