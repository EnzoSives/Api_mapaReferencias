import { Controller, Get, Post, Body, Param, Put, Delete, Query, ParseIntPipe } from '@nestjs/common';
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

  /**
   * Devuelve todos los marcadores con la información del año especificado.
   * Si el marcador tiene un snapshot de ese año, muestra esos datos.
   * Si no tiene snapshot, muestra los datos vivos actuales.
   * GET /marcador/por-anio/:anio
   */
  @Get('por-anio/:anio')
  findAllByAnio(@Param('anio') anio: string) {
    return this.marcadorService.findAllByAnio(+anio);
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

  // ==================== ENDPOINTS HISTORIAL ANUAL ====================

  /**
   * Obtiene los años disponibles para un marcador
   * GET /marcador/:id/anual/anios
   */
  @Get(':id/anual/anios')
  getAniosDisponibles(@Param('id') id: string) {
    return this.marcadorService.getAniosDisponibles(+id);
  }

  /**
   * Obtiene los datos de un marcador para un año específico
   * GET /marcador/:id/anual/:anio
   */
  @Get(':id/anual/:anio')
  findByAnio(@Param('id') id: string, @Param('anio') anio: string) {
    return this.marcadorService.findByAnio(+id, +anio);
  }

  /**
   * Congela/cierra los datos de un marcador para un año específico
   * POST /marcador/:id/anual/:anio/cerrar
   */
  @Post(':id/anual/:anio/cerrar')
  cerrarAnio(@Param('id') id: string, @Param('anio') anio: string) {
    return this.marcadorService.cerrarAnio(+id, +anio);
  }

  /**
   * Compara los datos de un marcador entre dos años
   * GET /marcador/:id/anual/comparar?anio1=2025&anio2=2026
   */
  @Get(':id/anual/comparar')
  compararAnios(
    @Param('id') id: string,
    @Query('anio1') anio1: string,
    @Query('anio2') anio2: string,
  ) {
    return this.marcadorService.compararAnios(+id, +anio1, +anio2);
  }

  /**
   * Cierra masivamente todos los marcadores para un año específico
   * POST /marcador/anual/:anio/cerrar-masivo
   */
  @Post('anual/:anio/cerrar-masivo')
  cerrarAnioMasivo(@Param('anio') anio: string) {
    return this.marcadorService.cerrarAnioMasivo(+anio);
  }

  // ==================== ENDPOINTS HISTORIAL (existentes) ====================

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
