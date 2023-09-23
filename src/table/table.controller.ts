import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  async create(@Body() createTableDto: CreateTableDto) {
    const table = await this.tableService.create(createTableDto);
    return table;
  }

  @Get()
  async findAll() {
    return await this.tableService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const table = await this.tableService.findById(+id);
    return table;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    const table = await this.tableService.update(+id, updateTableDto);
    return table;
  }
}
