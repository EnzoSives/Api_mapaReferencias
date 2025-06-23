import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { EstudioService } from './estudio.service';
import { CreateEstudioDto } from './dto/create-estudio.dto';
import { UpdateEstudioDto } from './dto/update-estudio.dto';

@Controller('estudio')
export class EstudioController {
  constructor(private readonly service: EstudioService) {} 

  @Post()
  create(@Body() dto: CreateEstudioDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateEstudioDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}