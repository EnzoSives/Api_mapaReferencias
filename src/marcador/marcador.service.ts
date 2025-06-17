import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Marcador } from './entities/marcador.entity';
import { IntegranteFamilia } from '../integrante_familiar/entities/integrante_familiar.entity';
import { Repository } from 'typeorm';
import { Programa } from 'src/programa/entities/programa.entity';

@Injectable()
export class MarcadorService {
  constructor(
    @InjectRepository(Marcador)
    private marcadorRepo: Repository<Marcador>,

    @InjectRepository(IntegranteFamilia)
    private integranteRepo: Repository<IntegranteFamilia>,

    @InjectRepository(Programa)
    private programaRepo: Repository<Programa>,
  ) {}

  create(data: Partial<Marcador>) {
    const nuevo = this.marcadorRepo.create(data);
    return this.marcadorRepo.save(nuevo);
  }

  findAll() {
    return this.marcadorRepo.find({ relations: ['integrantes', 'programas'] });
  }

  findOne(id: number) {
    return this.marcadorRepo.findOne({
      where: { id },
      relations: ['integrantes', 'programas'],
    });
  }

  async update(id: number, data: Partial<Marcador>) {
    const marcador = await this.marcadorRepo.findOne({
      where: { id },
      relations: ['integrantes', 'programas'],
    });

    if (!marcador) {
      throw new NotFoundException('Marcador no encontrado');
    }

    const { integrantes, programas, ...resto } = data;

    // Actualiza campos simples del marcador
    Object.assign(marcador, resto);

    // Manejo de integrantes (mantiene la lógica original si necesitas reemplazar)
    if (integrantes) {
      // Borra integrantes anteriores
      await this.integranteRepo.delete({ marcador: { id } });

      // Obtiene el marcador completo para asignar a los integrantes
      const marcadorCompleto = await this.marcadorRepo.findOne({ where: { id } });

      // Asocia los nuevos integrantes al marcador
      marcador.integrantes = integrantes.map((i) => ({
        ...i,
        marcador: marcadorCompleto,
      }));
    }

    // NUEVO MANEJO DE PROGRAMAS - PRESERVA EL HISTORIAL
    if (programas) {
      await this.actualizarProgramasConHistorial(id, programas);
    }

    // Guarda solo los cambios del marcador (sin los programas, que ya se manejaron)
    const { programas: _, ...marcadorSinProgramas } = marcador;
    return this.marcadorRepo.save(marcadorSinProgramas);
  }

  // NUEVO MÉTODO: Actualiza programas de forma granular
  private async actualizarProgramasConHistorial(marcadorId: number, nuevosProgramas: Partial<Programa>[]) {
    // 1. Obtener programas activos actuales
    const programasActivos = await this.programaRepo.find({
      where: { 
        marcador: { id: marcadorId },
        estado: 'activo'
      }
    });

    // 2. Comparar y determinar cambios
    const programasAMantener = [];
    const programasAFinalizar = [];
    const programasAAgregar = [];

    // Revisar programas existentes
    for (const programaActivo of programasActivos) {
      const existeEnNuevos = nuevosProgramas.some(nuevo => 
        nuevo.tipo === programaActivo.tipo && nuevo.ayuda === programaActivo.ayuda
      );
      
      if (existeEnNuevos) {
        programasAMantener.push(programaActivo);
      } else {
        programasAFinalizar.push(programaActivo);
      }
    }

    // Revisar nuevos programas
    for (const nuevoPrograma of nuevosProgramas) {
      const existeEnActivos = programasActivos.some(activo => 
        activo.tipo === nuevoPrograma.tipo && activo.ayuda === nuevoPrograma.ayuda
      );
      
      if (!existeEnActivos) {
        programasAAgregar.push(nuevoPrograma);
      }
    }

    // 3. Aplicar cambios
    // Finalizar programas que ya no están en la lista
    for (const programa of programasAFinalizar) {
      programa.estado = 'finalizado';
      programa.fechaFin = new Date();
      await this.programaRepo.save(programa);
    }

    // Agregar nuevos programas
    await this.agregarNuevosProgramas(marcadorId, programasAAgregar);
  }

  // NUEVO MÉTODO: Finaliza programas activos (no los elimina)
  private async finalizarProgramasActivos(marcadorId: number) {
    const programasActivos = await this.programaRepo.find({
      where: { 
        marcador: { id: marcadorId },
        estado: 'activo'
      }
    });

    for (const programa of programasActivos) {
      programa.estado = 'finalizado';
      programa.fechaFin = new Date();
      await this.programaRepo.save(programa);
    }
  }

  // NUEVO MÉTODO: Agrega nuevos programas
  private async agregarNuevosProgramas(marcadorId: number, nuevosProgramas: Partial<Programa>[]) {
    const marcadorCompleto = await this.marcadorRepo.findOne({ where: { id: marcadorId } });
    
    for (const programaData of nuevosProgramas) {
      const nuevoPrograma = this.programaRepo.create({
        ...programaData,
        marcador: marcadorCompleto,
        estado: 'activo',
        fechaInicio: new Date(),
      });
      await this.programaRepo.save(nuevoPrograma);
    }
  }

  // NUEVOS MÉTODOS ÚTILES PARA MANEJAR PROGRAMAS

  // Obtener historial completo de programas de un marcador
  async obtenerHistorialProgramas(marcadorId: number): Promise<Programa[]> {
    return await this.programaRepo.find({
      where: { marcador: { id: marcadorId } },
      order: { fechaInicio: 'DESC' },
    });
  }

  // Obtener solo programas activos de un marcador
  async obtenerProgramasActivos(marcadorId: number): Promise<Programa[]> {
    return await this.programaRepo.find({
      where: { 
        marcador: { id: marcadorId },
        estado: 'activo'
      },
      order: { fechaInicio: 'DESC' },
    });
  }

  // MÉTODOS ADICIONALES PARA MANEJO GRANULAR DE PROGRAMAS

  // Agregar un programa específico sin tocar los demás
  async agregarProgramaSolo(marcadorId: number, programaData: Partial<Programa>): Promise<Programa> {
    const marcador = await this.marcadorRepo.findOne({ where: { id: marcadorId } });
    
    if (!marcador) {
      throw new NotFoundException('Marcador no encontrado');
    }

    // Verificar que no exista ya un programa activo igual
    const programaExistente = await this.programaRepo.findOne({
      where: {
        marcador: { id: marcadorId },
        tipo: programaData.tipo,
        ayuda: programaData.ayuda,
        estado: 'activo'
      }
    });

    if (programaExistente) {
      throw new Error('Ya existe un programa activo con el mismo tipo y ayuda');
    }

    const nuevoPrograma = this.programaRepo.create({
      ...programaData,
      marcador,
      estado: 'activo',
      fechaInicio: new Date(),
    });

    return await this.programaRepo.save(nuevoPrograma);
  }

  // Eliminar (finalizar) un programa específico por tipo y ayuda
  async eliminarProgramaEspecifico(marcadorId: number, tipo: string, ayuda: string): Promise<Programa | null> {
    const programa = await this.programaRepo.findOne({
      where: {
        marcador: { id: marcadorId },
        tipo,
        ayuda,
        estado: 'activo'
      }
    });

    if (!programa) {
      return null;
    }

    programa.estado = 'finalizado';
    programa.fechaFin = new Date();

    return await this.programaRepo.save(programa);
  }

  // Finalizar un programa específico
  async finalizarPrograma(programaId: number): Promise<Programa> {
    const programa = await this.programaRepo.findOne({ where: { id: programaId } });
    
    if (!programa) {
      throw new NotFoundException('Programa no encontrado');
    }

    programa.estado = 'finalizado';
    programa.fechaFin = new Date();

    return await this.programaRepo.save(programa);
  }

  // Método original sin cambios
  remove(id: number) {
    return this.marcadorRepo.delete(id);
  }
}