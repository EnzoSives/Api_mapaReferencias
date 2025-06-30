import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marcador } from './entities/marcador.entity';
import { MarcadorHistorial } from './entities/marcador-historial.entity';
import { IntegranteFamilia } from '../integrante_familiar/entities/integrante_familiar.entity';
import { Programa } from '../programa/entities/programa.entity';

@Injectable()
export class MarcadorService {
  constructor(
    @InjectRepository(Marcador)
    private marcadorRepo: Repository<Marcador>,

    @InjectRepository(MarcadorHistorial)
    private marcadorHistorialRepo: Repository<MarcadorHistorial>,

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
    return this.marcadorRepo.find({
      relations: [
        'integrantes',
        'integrantes.salud',
        'programas',
        'estudios',
        'ocupaciones',
        'viviendas',
        'servicios',
        'salud',
      ],
    });
  }

  findOne(id: number) {
    return this.marcadorRepo.findOne({
      where: { id },
      relations: [
        'integrantes',
        'integrantes.salud',
        'programas',
        'estudios',
        'ocupaciones',
        'viviendas',
        'servicios',
        'salud',
      ],
    });
  }

  // Método especial para crear historial manualmente cuando actualizas relaciones
  private async crearHistorialManual(marcadorId: number, tipoOperacion: string = 'RELATION_UPDATE') {
    const marcadorCompleto = await this.marcadorRepo.findOne({
      where: { id: marcadorId },
      relations: [
        'integrantes',
        'integrantes.salud',
        'programas',
        'estudios',
        'ocupaciones',
        'viviendas',
        'servicios',
        'salud',
      ],
    });

    if (marcadorCompleto) {
      const historial = new MarcadorHistorial(marcadorCompleto);
      historial.tipo_operacion = tipoOperacion;
      await this.marcadorHistorialRepo.save(historial);
    }
  }

  async update(id: number, data: Partial<Marcador>) {
    // Primero verificar que el marcador existe
    const marcadorExistente = await this.marcadorRepo.findOne({
      where: { id },
      relations: [
        'integrantes',
        'programas',
        'estudios',
        'ocupaciones',
        'viviendas',
        'servicios',
        'salud',
      ],
    });

    if (!marcadorExistente) {
      throw new NotFoundException('Marcador no encontrado');
    }

    const {
      integrantes,
      programas,
      estudios,
      ocupaciones,
      viviendas,
      servicios,
      salud,
      ...resto
    } = data;

    // Crear historial manual antes de cualquier cambio significativo en relaciones
    const tieneRelaciones = integrantes || programas || estudios || ocupaciones || viviendas || servicios || salud;
    if (tieneRelaciones) {
      await this.crearHistorialManual(id, 'BEFORE_RELATIONS_UPDATE');
    }

    // 1. PRIMERO: Actualizar programas con historial (antes de modificar el marcador)
    if (programas) {
      await this.actualizarProgramasConHistorial(id, programas);
    }

    // 2. SEGUNDO: Actualizar integrantes
    if (integrantes) {
      // Eliminar integrantes existentes
      await this.integranteRepo.delete({ marcador: { id } });

      // Crear nuevos integrantes
      const nuevosIntegrantes = integrantes.map((i) => {
        const { salud: saludIntegrante, ...iData } = i;
        return this.integranteRepo.create({
          ...iData,
          marcador: marcadorExistente,
          salud: saludIntegrante?.map((s) => ({ ...s })) || [],
        });
      });

      // Guardar los nuevos integrantes
      await this.integranteRepo.save(nuevosIntegrantes);
    }

    // 3. TERCERO: Actualizar campos simples del marcador
    // (El subscriber se encargará automáticamente del historial aquí)
    if (Object.keys(resto).length > 0) {
      await this.marcadorRepo.update(id, resto);
    }

    // 4. CUARTO: Actualizar relaciones simples (que se reemplazan completamente)
    const relacionesAActualizar: any = {};
    
    if (estudios) relacionesAActualizar.estudios = estudios.map((e) => ({ ...e }));
    if (ocupaciones) relacionesAActualizar.ocupaciones = ocupaciones.map((o) => ({ ...o }));
    if (viviendas) relacionesAActualizar.viviendas = viviendas.map((v) => ({ ...v }));
    if (servicios) relacionesAActualizar.servicios = servicios.map((s) => ({ ...s }));
    if (salud) relacionesAActualizar.salud = salud.map((s) => ({ ...s }));

    if (Object.keys(relacionesAActualizar).length > 0) {
      await this.marcadorRepo.save({
        id,
        ...relacionesAActualizar
      });
    }

    // 5. FINALMENTE: Retornar el marcador actualizado con todas sus relaciones
    return this.marcadorRepo.findOne({
      where: { id },
      relations: [
        'integrantes',
        'integrantes.salud',
        'programas',
        'estudios',
        'ocupaciones',
        'viviendas',
        'servicios',
        'salud',
      ],
    });
  }

  private async actualizarProgramasConHistorial(marcadorId: number, nuevosProgramas: Partial<Programa>[]) {
    try {
      // Obtener programas activos actuales
      const programasActivos = await this.programaRepo.find({
        where: { marcador: { id: marcadorId }, estado: 'activo' }
      });

      console.log('Programas activos actuales:', programasActivos.length);

      const programasAFinalizar = programasActivos.filter(
        (p) =>
          !nuevosProgramas.some(
            (n) =>
              n.tipo === p.tipo &&
              n.ayuda === p.ayuda &&
              (n.notas || '') === (p.notas || '')
          )
      );

      const programasAAgregar = nuevosProgramas.filter(
        (n) =>
          !programasActivos.some(
            (p) =>
              n.tipo === p.tipo &&
              n.ayuda === p.ayuda &&
              (n.notas || '') === (p.notas || '')
          )
      );

      console.log('Programas a finalizar:', programasAFinalizar.length);
      console.log('Programas a agregar:', programasAAgregar.length);

      // Finalizar programas que ya no están en la nueva lista
      for (const programa of programasAFinalizar) {
        programa.estado = 'finalizado';
        programa.fechaFin = new Date();
        await this.programaRepo.save(programa);
        console.log(`Programa finalizado: ${programa.tipo} - ${programa.ayuda}`);
      }

      // Obtener referencia del marcador para los nuevos programas
      const marcador = await this.marcadorRepo.findOne({ where: { id: marcadorId } });
      
      if (!marcador) {
        throw new Error('Marcador no encontrado para agregar programas');
      }

      // Agregar nuevos programas
      for (const programaData of programasAAgregar) {
        const nuevoPrograma = this.programaRepo.create({
          ...programaData,
          marcador,
          estado: 'activo',
          fechaInicio: new Date(),
        });
        
        const programaGuardado = await this.programaRepo.save(nuevoPrograma);
        console.log(`Programa agregado: ${programaGuardado.tipo} - ${programaGuardado.ayuda}`);
      }

      console.log('Actualización de programas completada exitosamente');
      
    } catch (error) {
      console.error('Error actualizando programas con historial:', error);
      throw new Error(`Error actualizando programas: ${error.message}`);
    }
  }

async remove(id: number) {
  // Eliminar registros relacionados manualmente
  await this.integranteRepo.delete({ marcador: { id } });
  await this.programaRepo.delete({ marcador: { id } });
  // Agregá otras entidades si es necesario, como estudios, ocupaciones, salud, etc.

  // Finalmente eliminá el marcador
  return this.marcadorRepo.delete(id);
}


  // Métodos nuevos para gestionar el historial
  async getHistorial(marcadorId: number): Promise<MarcadorHistorial[]> {
    return this.marcadorHistorialRepo.find({
      where: { marcador_id: marcadorId },
      order: { fecha_modificacion: 'DESC' },
    });
  }

  async getHistorialPorFecha(marcadorId: number, fechaDesde: Date, fechaHasta?: Date): Promise<MarcadorHistorial[]> {
    const query = this.marcadorHistorialRepo.createQueryBuilder('historial')
      .where('historial.marcador_id = :marcadorId', { marcadorId })
      .andWhere('historial.fecha_modificacion >= :fechaDesde', { fechaDesde });

    if (fechaHasta) {
      query.andWhere('historial.fecha_modificacion <= :fechaHasta', { fechaHasta });
    }

    return query.orderBy('historial.fecha_modificacion', 'DESC').getMany();
  }

  async getUltimaVersion(marcadorId: number): Promise<MarcadorHistorial> {
    return this.marcadorHistorialRepo.findOne({
      where: { marcador_id: marcadorId },
      order: { fecha_modificacion: 'DESC' },
    });
  }

  async compararVersiones(marcadorId: number, fecha1: Date, fecha2: Date): Promise<{
    version1: MarcadorHistorial,
    version2: MarcadorHistorial,
    diferencias: any
  }> {
    const version1 = await this.marcadorHistorialRepo
      .createQueryBuilder('historial')
      .where('historial.marcador_id = :marcadorId', { marcadorId })
      .andWhere('historial.fecha_modificacion <= :fecha1', { fecha1 })
      .orderBy('historial.fecha_modificacion', 'DESC')
      .getOne();

    const version2 = await this.marcadorHistorialRepo
      .createQueryBuilder('historial')
      .where('historial.marcador_id = :marcadorId', { marcadorId })
      .andWhere('historial.fecha_modificacion <= :fecha2', { fecha2 })
      .orderBy('historial.fecha_modificacion', 'DESC')
      .getOne();

    const diferencias = {};
    if (version1 && version2) {
      const campos = ['nombre', 'apellido', 'direccion', 'telefono', 'dni', 'barrio', 'tiempo_residencia', 'notas', 'latitud', 'longitud', 'icono'];
      campos.forEach(campo => {
        if (version1[campo] !== version2[campo]) {
          diferencias[campo] = {
            anterior: version1[campo],
            nuevo: version2[campo]
          };
        }
      });
    }

    return { version1, version2, diferencias };
  }
}