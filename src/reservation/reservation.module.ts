import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { TableModule } from 'src/table/table.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [PrismaModule, UserModule, TableModule, JwtModule]
})
export class ReservationModule {}
