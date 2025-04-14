import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MarcadorService } from './marcador.service';
import { Marcador } from './entities/marcador.entity';

@Controller('marcador')
export class MarcadorController {
  constructor(private readonly marcadorService: MarcadorService) {}

  @Post()
  create(@Body() data: Partial<Marcador>) {
    return this.marcadorService.create(data);
  }

  @Get()
  findAll() {
    return this.marcadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcadorService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Marcador>) {
    return this.marcadorService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcadorService.remove(+id);
  }
}
