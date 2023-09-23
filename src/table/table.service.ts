import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    const tables = await this.prisma.table.findMany();

    return tables;
  }

  async findById(id: number) {
    const table = await this.prisma.table.findFirst({
      where: { id }
    })

    if (!table) throw new NotFoundException("Table not found");

    return table;
  }
}
