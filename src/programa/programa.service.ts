import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Programa } from './entities/programa.entity';
import { Marcador } from '../marcador/entities/marcador.entity';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';

interface FiltrosProgramas {
  estado?: string;
  tipo?: string;
  ayuda?: string;
}

export interface EstadisticasProgramas {
  total: number;
  activos: number;
  finalizados: number;
  suspendidos: number;
  porTipo: { [tipo: string]: number };
  porAyuda: { [ayuda: string]: number };
}

@Injectable()
export class ProgramaService {
  constructor(
    @InjectRepository(Programa)
    private programaRepository: Repository<Programa>,
    @InjectRepository(Marcador)
    private marcadorRepository: Repository<Marcador>,
  ) {}

  // Métodos originales
  create(createProgramaDto: CreateProgramaDto) {
    const programa = this.programaRepository.create(createProgramaDto);
    return this.programaRepository.save(programa);
  }

  findAll() {
    return this.programaRepository.find({ relations: ['marcador'] });
  }

  findOne(id: number) {
    return this.programaRepository.findOne({
      where: { id },
      relations: ['marcador']
    });
  }

  async update(id: number, updateProgramaDto: UpdateProgramaDto) {
    const programa = await this.programaRepository.findOne({ where: { id } });
    if (!programa) {
      throw new NotFoundException('Programa no encontrado');
    }
    
    Object.assign(programa, updateProgramaDto);
    return this.programaRepository.save(programa);
  }

  remove(id: number) {
    return this.programaRepository.delete(id);
  }

  // NUEVOS MÉTODOS PARA LOS ENDPOINTS

  // Obtener historial completo de programas de un marcador
  async obtenerHistorialProgramas(marcadorId: number): Promise<Programa[]> {
    return await this.programaRepository.find({
      where: { marcador: { id: marcadorId } },
      relations: ['marcador'],
      order: { fechaInicio: 'DESC' }, // Más recientes primero
    });
  }

  // Obtener solo programas activos de un marcador
  async obtenerProgramasActivos(marcadorId: number): Promise<Programa[]> {
    return await this.programaRepository.find({
      where: { 
        marcador: { id: marcadorId },
        estado: 'activo'
      },
      relations: ['marcador'],
      order: { fechaInicio: 'DESC' },
    });
  }

  // Obtener programas por estado específico
  async obtenerProgramasPorEstado(marcadorId: number, estado: string): Promise<Programa[]> {
    return await this.programaRepository.find({
      where: { 
        marcador: { id: marcadorId },
        estado: estado
      },
      relations: ['marcador'],
      order: { fechaInicio: 'DESC' },
    });
  }

  // Obtener programas con filtros
  async obtenerProgramasFiltrados(marcadorId: number, filtros: FiltrosProgramas): Promise<Programa[]> {
    const whereConditions: any = { marcador: { id: marcadorId } };

    if (filtros.estado) {
      whereConditions.estado = filtros.estado;
    }
    if (filtros.tipo) {
      whereConditions.tipo = filtros.tipo;
    }
    if (filtros.ayuda) {
      whereConditions.ayuda = filtros.ayuda;
    }

    return await this.programaRepository.find({
      where: whereConditions,
      relations: ['marcador'],
      order: { fechaInicio: 'DESC' },
    });
  }

  // Finalizar un programa
  async finalizarPrograma(id: number): Promise<Programa> {
    const programa = await this.programaRepository.findOne({ where: { id } });
    
    if (!programa) {
      throw new NotFoundException('Programa no encontrado');
    }

    programa.estado = 'finalizado';
    programa.fechaFin = new Date();

    return await this.programaRepository.save(programa);
  }

  // Suspender un programa
  async suspenderPrograma(id: number): Promise<Programa> {
    const programa = await this.programaRepository.findOne({ where: { id } });
    
    if (!programa) {
      throw new NotFoundException('Programa no encontrado');
    }

    programa.estado = 'suspendido';
    // No asignamos fechaFin porque podría reactivarse

    return await this.programaRepository.save(programa);
  }

  // Reactivar un programa suspendido
  async reactivarPrograma(id: number): Promise<Programa> {
    const programa = await this.programaRepository.findOne({ where: { id } });
    
    if (!programa) {
      throw new NotFoundException('Programa no encontrado');
    }

    if (programa.estado !== 'suspendido') {
      throw new Error('Solo se pueden reactivar programas suspendidos');
    }

    programa.estado = 'activo';
    programa.fechaFin = null; // Limpiamos la fecha de fin si la había

    return await this.programaRepository.save(programa);
  }

  // Obtener estadísticas de programas de un marcador
  async obtenerEstadisticasProgramas(marcadorId: number): Promise<EstadisticasProgramas> {
    const programas = await this.obtenerHistorialProgramas(marcadorId);

    const estadisticas: EstadisticasProgramas = {
      total: programas.length,
      activos: 0,
      finalizados: 0,
      suspendidos: 0,
      porTipo: {},
      porAyuda: {}
    };

    programas.forEach(programa => {
      // Contar por estado
      switch (programa.estado) {
        case 'activo':
          estadisticas.activos++;
          break;
        case 'finalizado':
          estadisticas.finalizados++;
          break;
        case 'suspendido':
          estadisticas.suspendidos++;
          break;
      }

      // Contar por tipo
      estadisticas.porTipo[programa.tipo] = (estadisticas.porTipo[programa.tipo] || 0) + 1;

      // Contar por ayuda
      estadisticas.porAyuda[programa.ayuda] = (estadisticas.porAyuda[programa.ayuda] || 0) + 1;
    });

    return estadisticas;
  }
}