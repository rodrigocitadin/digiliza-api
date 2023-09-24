import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TableController],
  providers: [TableService],
  imports: [PrismaModule],
  exports: [TableService]
})
export class TableModule {}
