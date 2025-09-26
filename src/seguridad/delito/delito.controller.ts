import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { DelitoService } from './delito.service';
import { CreateDelitoDto } from './dto/create-delito.dto';
import { UpdateDelitoDto } from './dto/update-delito.dto';

@Controller('delito')
export class DelitoController {
  constructor(private readonly service: DelitoService) {}

  @Post()
  create(@Body() dto: CreateDelitoDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateDelitoDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}