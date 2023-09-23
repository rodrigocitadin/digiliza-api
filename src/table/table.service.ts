import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';

@Injectable()
export class TableService {
  constructor(private prisma: PrismaService) { }

  async create(createTableDto: CreateTableDto) {
    try {
      const table = await this.prisma.table.create({
        data: createTableDto
      })

      return table;
    }
    catch (error) {
      throw new BadRequestException(error.name);
    }
  }
}
