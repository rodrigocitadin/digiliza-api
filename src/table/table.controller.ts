import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTableDto: CreateTableDto) {
    const table = await this.tableService.create(createTableDto);
    return table;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.tableService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const table = await this.tableService.findById(+id);
    return table;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    const table = await this.tableService.update(+id, updateTableDto);
    return table;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.tableService.remove(+id);
  }
}
