import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ViviendaService } from './vivienda.service';
import { CreateViviendaDto } from './dto/create-vivienda.dto';
import { UpdateViviendaDto } from './dto/update-vivienda.dto';

@Controller('vivienda')
export class ViviendaController {
  constructor(private readonly service: ViviendaService) {} 

  @Post()
  create(@Body() dto: CreateViviendaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateViviendaDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}