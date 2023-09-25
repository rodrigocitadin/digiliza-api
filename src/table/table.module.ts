import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [TableController],
  providers: [TableService],
  imports: [PrismaModule, JwtModule],
  exports: [TableService]
})
export class TableModule {}
