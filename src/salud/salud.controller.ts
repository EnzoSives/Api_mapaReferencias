import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SaludService } from './salud.service';
import { CreateSaludDto } from './dto/create-salud.dto';
import { UpdateSaludDto } from './dto/update-salud.dto';

@Controller('salud')
export class SaludController {
  constructor(private readonly service: SaludService) {} 

  @Post()
  create(@Body() dto: CreateSaludDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateSaludDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}