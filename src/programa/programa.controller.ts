import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProgramaService, EstadisticasProgramas} from './programa.service';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';

@Controller('programa')
export class ProgramaController {
  constructor(private readonly programaService: ProgramaService) {}

  @Post()
  create(@Body() createProgramaDto: CreateProgramaDto) {
    return this.programaService.create(createProgramaDto);
  }

  @Get()
  findAll() {
    return this.programaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProgramaDto: UpdateProgramaDto) {
    return this.programaService.update(+id, updateProgramaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programaService.remove(+id);
  }

  // NUEVOS ENDPOINTS PARA VER PROGRAMAS POR MARCADOR

  // Ver historial completo de programas de un marcador
  // GET /programa/marcador/123/historial
  @Get('marcador/:marcadorId/historial')
  obtenerHistorialProgramas(@Param('marcadorId') marcadorId: string) {
    return this.programaService.obtenerHistorialProgramas(+marcadorId);
  }

  // Ver solo programas activos de un marcador
  // GET /programa/marcador/123/activos
  @Get('marcador/:marcadorId/activos')
  obtenerProgramasActivos(@Param('marcadorId') marcadorId: string) {
    return this.programaService.obtenerProgramasActivos(+marcadorId);
  }

  // Ver programas por estado específico de un marcador
  // GET /programa/marcador/123/estado/finalizado
  // GET /programa/marcador/123/estado/suspendido
  @Get('marcador/:marcadorId/estado/:estado')
  obtenerProgramasPorEstado(
    @Param('marcadorId') marcadorId: string,
    @Param('estado') estado: string
  ) {
    return this.programaService.obtenerProgramasPorEstado(+marcadorId, estado);
  }

  // Ver programas con filtros opcionales
  // GET /programa/marcador/123?estado=activo&tipo=Alimentos
  @Get('marcador/:marcadorId')
  obtenerProgramasFiltrados(
    @Param('marcadorId') marcadorId: string,
    @Query('estado') estado?: string,
    @Query('tipo') tipo?: string,
    @Query('ayuda') ayuda?: string
  ) {
    return this.programaService.obtenerProgramasFiltrados(+marcadorId, {
      estado,
      tipo,
      ayuda
    });
  }

  // Finalizar un programa específico
  // PATCH /programa/123/finalizar
  @Patch(':id/finalizar')
  finalizarPrograma(@Param('id') id: string) {
    return this.programaService.finalizarPrograma(+id);
  }

  // Suspender un programa específico
  // PATCH /programa/123/suspender
  @Patch(':id/suspender')
  suspenderPrograma(@Param('id') id: string) {
    return this.programaService.suspenderPrograma(+id);
  }

  // Reactivar un programa suspendido
  // PATCH /programa/123/reactivar
  @Patch(':id/reactivar')
  reactivarPrograma(@Param('id') id: string) {
    return this.programaService.reactivarPrograma(+id);
  }

  // Estadísticas de programas por marcador
  // GET /programa/marcador/123/estadisticas
  @Get('marcador/:marcadorId/estadisticas')
  obtenerEstadisticasProgramas(@Param('marcadorId') marcadorId: string): Promise<EstadisticasProgramas> {
    return this.programaService.obtenerEstadisticasProgramas(+marcadorId);
  }
}