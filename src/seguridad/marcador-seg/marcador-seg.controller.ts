import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MarcadorSegService } from './marcador-seg.service';
import { CreateMarcadorSegDto } from './dto/create-marcador-seg.dto';
import { UpdateMarcadorSegDto } from './dto/update-marcador-seg.dto';

@Controller('marcador-seg')
export class MarcadorSegController {
  constructor(private readonly service: MarcadorSegService) {}

  @Post()
  create(@Body() dto: CreateMarcadorSegDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateMarcadorSegDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}