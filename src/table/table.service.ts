import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TableService {
  constructor(private prisma: PrismaService) { }

  async create(createTableDto: CreateTableDto) {
    const tables = await this.findAll();
    if (tables.length >= 15) throw new BadRequestException("Maximum tables reached")

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

  async update(id: number, updateTableDto: UpdateTableDto) {
    await this.findById(id);

    try {
      const table = await this.prisma.table.update({
        where: { id },
        data: updateTableDto
      })

      return table;
    }
    catch (error) {
      throw new BadRequestException(error.name);
    }
  }

  async remove(id: number) {
    await this.findById(id)
    await this.prisma.table.delete({ where: { id } });
  }
}
