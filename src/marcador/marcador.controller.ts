import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
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

   // Endpoints para el historial
  @Get(':id/historial')
  getHistorial(@Param('id') id: string) {
    return this.marcadorService.getHistorial(+id);
  }

  @Get(':id/historial/rango')
  getHistorialPorFecha(
    @Param('id') id: string,
    @Query('desde') desde: string,
    @Query('hasta') hasta?: string
  ) {
    const fechaDesde = new Date(desde);
    const fechaHasta = hasta ? new Date(hasta) : undefined;
    return this.marcadorService.getHistorialPorFecha(+id, fechaDesde, fechaHasta);
  }

  @Get(':id/historial/ultima')
  getUltimaVersion(@Param('id') id: string) {
    return this.marcadorService.getUltimaVersion(+id);
  }

  @Get(':id/historial/comparar')
  compararVersiones(
    @Param('id') id: string,
    @Query('fecha1') fecha1: string,
    @Query('fecha2') fecha2: string
  ) {
    return this.marcadorService.compararVersiones(+id, new Date(fecha1), new Date(fecha2));
  }
}
