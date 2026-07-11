import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marcador } from './entities/marcador.entity';
import { MarcadorHistorial } from './entities/marcador-historial.entity';
import { MarcadorAnual } from './entities/marcador-anual.entity';
import { IntegranteFamilia } from '../integrante_familiar/entities/integrante_familiar.entity';
import { Programa } from '../programa/entities/programa.entity';

@Injectable()
export class MarcadorService {
  constructor(
    @InjectRepository(Marcador)
    private marcadorRepo: Repository<Marcador>,

    @InjectRepository(MarcadorHistorial)
    private marcadorHistorialRepo: Repository<MarcadorHistorial>,

    @InjectRepository(MarcadorAnual)
    private marcadorAnualRepo: Repository<MarcadorAnual>,

    @InjectRepository(IntegranteFamilia)
    private integranteRepo: Repository<IntegranteFamilia>,

    @InjectRepository(Programa)
    private programaRepo: Repository<Programa>,
  ) {}

  create(data: Partial<Marcador>) {
    const anioActual = new Date().getFullYear();
    const nuevo = this.marcadorRepo.create({
      ...data,
      anios: data.anios ?? [anioActual],
    });
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

  // Crea automáticamente un snapshot anual del año anterior si todavía no existe,
  // preservando el estado pre-update del marcador.
  private async autoSnapshotAnual(marcadorId: number, marcadorConRelaciones: any) {
    const anioActual = new Date().getFullYear();
    const anioCierre = anioActual - 1;

    // Solo aplica si el marcador fue creado antes del año actual
    const anioCreacion = new Date(marcadorConRelaciones.fechaCreacion).getFullYear();
    if (anioCreacion >= anioActual) return;

    // Verificar si ya existe snapshot para el año anterior
    const yaExiste = await this.marcadorAnualRepo.findOne({
      where: { marcador_id: marcadorId, anio: anioCierre },
    });
    if (yaExiste) return;

    // Cargar con todas las relaciones necesarias para el snapshot
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

    const snapshot = this.marcadorAnualRepo.create({
      marcador_id: marcadorId,
      marcador: marcadorCompleto,
      anio: anioCierre,
      nombre: marcadorCompleto.nombre,
      apellido: marcadorCompleto.apellido,
      direccion: marcadorCompleto.direccion,
      telefono: marcadorCompleto.telefono,
      dni: marcadorCompleto.dni,
      barrio: marcadorCompleto.barrio,
      tiempo_residencia: marcadorCompleto.tiempo_residencia,
      notas: marcadorCompleto.notas,
      latitud: marcadorCompleto.latitud,
      longitud: marcadorCompleto.longitud,
      icono: marcadorCompleto.icono,
      integrantes_snapshot: marcadorCompleto.integrantes || [],
      programas_snapshot: marcadorCompleto.programas || [],
      estudios_snapshot: marcadorCompleto.estudios || [],
      ocupaciones_snapshot: marcadorCompleto.ocupaciones || [],
      viviendas_snapshot: marcadorCompleto.viviendas || [],
      servicios_snapshot: marcadorCompleto.servicios || [],
      salud_snapshot: marcadorCompleto.salud || [],
      fechaCierre: new Date(),
    });

    await this.marcadorAnualRepo.save(snapshot);

    // Agregar el año actual a anios si todavía no está
    const aniosActuales: number[] = marcadorConRelaciones.anios || [];
    if (!aniosActuales.includes(anioActual)) {
      await this.marcadorRepo.update(marcadorId, {
        anios: [...aniosActuales, anioActual],
      });
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

    // Auto-snapshot anual: si el marcador fue creado antes del año actual y no existe
    // snapshot del año anterior, guardar el estado actual como snapshot de ese año.
    await this.autoSnapshotAnual(id, marcadorExistente);

    const {
      integrantes,
      programas,
      estudios,
      ocupaciones,
      viviendas,
      servicios,
      salud,
      // campos virtuales que devuelve findAllByAnio, no pertenecen a la entidad
      anio_dato,
      esDatoVivo,
      ...resto
    } = data as any;

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
    const programasActuales = await this.programaRepo.find({
      where: { marcador: { id: marcadorId } },
    });

    const programasNuevosConId = nuevosProgramas.filter(p => p.id);
    const programasNuevosSinId = nuevosProgramas.filter(p => !p.id);
    const idsDeProgramasNuevos = programasNuevosConId.map(p => p.id);

    // 1. Actualizar programas existentes
    for (const programa of programasNuevosConId) {
      await this.programaRepo.update(programa.id, programa);
    }

    // 2. Eliminar programas que ya no existen
    const programasAEliminar = programasActuales.filter(
      p => !idsDeProgramasNuevos.includes(p.id)
    );
    for (const programa of programasAEliminar) {
      await this.programaRepo.remove(programa);
    }

    // 3. Agregar nuevos programas
    const marcador = await this.marcadorRepo.findOne({ where: { id: marcadorId } });
    if (!marcador) {
      throw new Error('Marcador no encontrado para agregar programas');
    }
    for (const programaData of programasNuevosSinId) {
      const nuevoPrograma = this.programaRepo.create({
        ...programaData,
        marcador,
        estado: 'activo',
        fechaInicio: new Date(),
      });
      await this.programaRepo.save(nuevoPrograma);
    }

  } catch (error) {
    console.error('Error actualizando programas con historial:', error);
    throw new Error(`Error actualizando programas`);
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

  // ==================== MÉTODOS PARA HISTORIAL ANUAL ====================

  /**
   * Devuelve todos los marcadores con los datos correspondientes al año pedido.
   * - Si anio >= año actual → datos vivos
   * - Si hay snapshot con anio <= anio pedido → usa el snapshot más reciente disponible
   * - Si no hay ningún snapshot → usa datos vivos (nunca fue modificado)
   */
  async findAllByAnio(anio: number): Promise<any[]> {
    const anioActual = new Date().getFullYear();

    // Filtrar marcadores: creados en el año pedido O que tienen ese año en su array anios
    const marcadores = await this.marcadorRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.integrantes', 'integrantes')
      .leftJoinAndSelect('integrantes.salud', 'integranteSalud')
      .leftJoinAndSelect('m.programas', 'programas')
      .leftJoinAndSelect('m.estudios', 'estudios')
      .leftJoinAndSelect('m.ocupaciones', 'ocupaciones')
      .leftJoinAndSelect('m.viviendas', 'viviendas')
      .leftJoinAndSelect('m.servicios', 'servicios')
      .leftJoinAndSelect('m.salud', 'salud')
      .where('YEAR(m.fechaCreacion) = :anio', { anio })
      .orWhere('(m.anios IS NOT NULL AND JSON_CONTAINS(m.anios, :anioVal))', {
        anioVal: JSON.stringify(anio),
      })
      .getMany();

    // Si piden el año actual o futuro, devolver datos vivos directamente
    if (anio >= anioActual) {
      return marcadores.map((m) => ({
        ...m,
        anio_dato: anioActual,
        esDatoVivo: true,
      }));
    }

    if (marcadores.length === 0) return [];

    // Para años pasados, buscar el snapshot más cercano sin pasarse del año pedido
    // (solo para los marcadores filtrados)
    const marcadorIds = marcadores.map((m) => m.id);
    const snapshots = await this.marcadorAnualRepo
      .createQueryBuilder('a')
      .where('a.marcador_id IN (:...marcadorIds)', { marcadorIds })
      .andWhere('a.anio <= :anio', { anio })
      .orderBy('a.anio', 'DESC')
      .getMany();

    // Indexar por marcador_id → snapshot más reciente (≤ anio)
    const snapshotPorMarcador = new Map<number, MarcadorAnual>();
    for (const snap of snapshots) {
      if (!snapshotPorMarcador.has(snap.marcador_id)) {
        snapshotPorMarcador.set(snap.marcador_id, snap);
      }
    }

    return marcadores.map((m) => {
      const snap = snapshotPorMarcador.get(m.id);

      if (!snap) {
        // Sin snapshot → usar datos vivos (marcador nunca fue modificado)
        return {
          ...m,
          anio_dato: anioActual,
          esDatoVivo: true,
        };
      }

      return {
        id: m.id,
        anio_dato: snap.anio,
        esDatoVivo: false,
        nombre: snap.nombre,
        apellido: snap.apellido,
        direccion: snap.direccion,
        telefono: snap.telefono,
        dni: snap.dni,
        barrio: snap.barrio,
        tiempo_residencia: snap.tiempo_residencia,
        notas: snap.notas,
        latitud: snap.latitud,
        longitud: snap.longitud,
        icono: snap.icono,
        integrantes: snap.integrantes_snapshot,
        programas: snap.programas_snapshot,
        estudios: snap.estudios_snapshot,
        ocupaciones: snap.ocupaciones_snapshot,
        viviendas: snap.viviendas_snapshot,
        servicios: snap.servicios_snapshot,
        salud: snap.salud_snapshot,
        fechaCreacion: m.fechaCreacion,
      };
    });
  }

  /**
   * Congela los datos actuales de un marcador para un año específico.
   * Si ya existe un registro para ese año, lo actualiza.
   */
  async cerrarAnio(marcadorId: number, anio: number): Promise<MarcadorAnual> {
    const marcador = await this.marcadorRepo.findOne({
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

    if (!marcador) {
      throw new NotFoundException('Marcador no encontrado');
    }

    // Verificar si ya existe un registro para ese año
    let registroAnual = await this.marcadorAnualRepo.findOne({
      where: { marcador_id: marcadorId, anio },
    });

    if (registroAnual) {
      // Actualizar el snapshot existente
      registroAnual.nombre = marcador.nombre;
      registroAnual.apellido = marcador.apellido;
      registroAnual.direccion = marcador.direccion;
      registroAnual.telefono = marcador.telefono;
      registroAnual.dni = marcador.dni;
      registroAnual.barrio = marcador.barrio;
      registroAnual.tiempo_residencia = marcador.tiempo_residencia;
      registroAnual.notas = marcador.notas;
      registroAnual.latitud = marcador.latitud;
      registroAnual.longitud = marcador.longitud;
      registroAnual.icono = marcador.icono;
      registroAnual.integrantes_snapshot = marcador.integrantes || [];
      registroAnual.programas_snapshot = marcador.programas || [];
      registroAnual.estudios_snapshot = marcador.estudios || [];
      registroAnual.ocupaciones_snapshot = marcador.ocupaciones || [];
      registroAnual.viviendas_snapshot = marcador.viviendas || [];
      registroAnual.servicios_snapshot = marcador.servicios || [];
      registroAnual.salud_snapshot = marcador.salud || [];
      registroAnual.fechaCierre = new Date();
    } else {
      // Crear nuevo registro anual
      registroAnual = this.marcadorAnualRepo.create({
        marcador_id: marcadorId,
        marcador: marcador,
        anio,
        nombre: marcador.nombre,
        apellido: marcador.apellido,
        direccion: marcador.direccion,
        telefono: marcador.telefono,
        dni: marcador.dni,
        barrio: marcador.barrio,
        tiempo_residencia: marcador.tiempo_residencia,
        notas: marcador.notas,
        latitud: marcador.latitud,
        longitud: marcador.longitud,
        icono: marcador.icono,
        integrantes_snapshot: marcador.integrantes || [],
        programas_snapshot: marcador.programas || [],
        estudios_snapshot: marcador.estudios || [],
        ocupaciones_snapshot: marcador.ocupaciones || [],
        viviendas_snapshot: marcador.viviendas || [],
        servicios_snapshot: marcador.servicios || [],
        salud_snapshot: marcador.salud || [],
        fechaCierre: new Date(),
      });
    }

    const snapshotGuardado = await this.marcadorAnualRepo.save(registroAnual);

    // Agregar el año siguiente a anios del marcador vivo
    const proxAnio = anio + 1;
    const aniosActuales: number[] = marcador.anios || [];
    if (!aniosActuales.includes(proxAnio)) {
      await this.marcadorRepo.update(marcadorId, {
        anios: [...aniosActuales, proxAnio],
      });
    }

    // Limpiar programas y notas del marcador vivo para el año nuevo
    await this.limpiarParaAnioNuevo(marcadorId);

    return snapshotGuardado;
  }

  /**
   * Limpia programas y notas del marcador vivo para empezar el año nuevo en blanco.
   * Solo se llama después de haber guardado el snapshot del año cerrado.
   */
  private async limpiarParaAnioNuevo(marcadorId: number): Promise<void> {
    // Eliminar todos los programas del marcador
    await this.programaRepo.delete({ marcador: { id: marcadorId } });

    // Limpiar notas del marcador
    await this.marcadorRepo.update(marcadorId, { notas: null });
  }

  /**
   * Obtiene los datos de un marcador para un año específico.
   * Si es el año actual y no hay snapshot, devuelve los datos vivos.
   * Si es un año pasado, devuelve el snapshot congelado.
   */
  async findByAnio(marcadorId: number, anio: number) {
    const anioActual = new Date().getFullYear();

    // Si es el año actual, devolver datos vivos
    if (anio === anioActual) {
      const marcador = await this.findOne(marcadorId);
      if (!marcador) {
        throw new NotFoundException('Marcador no encontrado');
      }
      return {
        anio,
        esDatoVivo: true,
        marcador,
      };
    }

    // Si es un año pasado, buscar el snapshot
    const registroAnual = await this.marcadorAnualRepo.findOne({
      where: { marcador_id: marcadorId, anio },
    });

    if (!registroAnual) {
      throw new NotFoundException(`No se encontraron datos del marcador para el año ${anio}`);
    }

    return {
      anio,
      esDatoVivo: false,
      marcador: {
        id: marcadorId,
        nombre: registroAnual.nombre,
        apellido: registroAnual.apellido,
        direccion: registroAnual.direccion,
        telefono: registroAnual.telefono,
        dni: registroAnual.dni,
        barrio: registroAnual.barrio,
        tiempo_residencia: registroAnual.tiempo_residencia,
        notas: registroAnual.notas,
        latitud: registroAnual.latitud,
        longitud: registroAnual.longitud,
        icono: registroAnual.icono,
        integrantes: registroAnual.integrantes_snapshot,
        programas: registroAnual.programas_snapshot,
        estudios: registroAnual.estudios_snapshot,
        ocupaciones: registroAnual.ocupaciones_snapshot,
        viviendas: registroAnual.viviendas_snapshot,
        servicios: registroAnual.servicios_snapshot,
        salud: registroAnual.salud_snapshot,
      },
      fechaCierre: registroAnual.fechaCierre,
    };
  }

  /**
   * Obtiene todos los años disponibles para un marcador.
   */
  async getAniosDisponibles(marcadorId: number): Promise<number[]> {
    const marcador = await this.marcadorRepo.findOne({ where: { id: marcadorId } });
    if (!marcador) {
      throw new NotFoundException('Marcador no encontrado');
    }

    const registros = await this.marcadorAnualRepo.find({
      where: { marcador_id: marcadorId },
      select: ['anio'],
      order: { anio: 'DESC' },
    });

    const anios = registros.map((r) => r.anio);

    // Agregar el año actual si no está en la lista
    const anioActual = new Date().getFullYear();
    if (!anios.includes(anioActual)) {
      anios.unshift(anioActual);
    }

    return anios;
  }

  /**
   * Congela todos los marcadores para un año específico (operación masiva).
   * Útil para cerrar un año completo de una vez.
   */
  async cerrarAnioMasivo(anio: number): Promise<{ total: number; procesados: number }> {
    const marcadores = await this.marcadorRepo.find();
    let procesados = 0;

    for (const marcador of marcadores) {
      // Solo congelar si no existe ya un registro para ese año
      const existente = await this.marcadorAnualRepo.findOne({
        where: { marcador_id: marcador.id, anio },
      });

      if (!existente) {
        await this.cerrarAnio(marcador.id, anio);
        procesados++;
      }
    }

    return { total: marcadores.length, procesados };
  }

  /**
   * Compara datos de un marcador entre dos años.
   */
  async compararAnios(marcadorId: number, anio1: number, anio2: number) {
    const datos1 = await this.findByAnio(marcadorId, anio1);
    const datos2 = await this.findByAnio(marcadorId, anio2);

    const campos = ['nombre', 'apellido', 'direccion', 'telefono', 'dni', 'barrio', 'tiempo_residencia', 'notas', 'latitud', 'longitud', 'icono'];
    const diferencias = {};

    campos.forEach((campo) => {
      const val1 = datos1.marcador[campo];
      const val2 = datos2.marcador[campo];
      if (val1 !== val2) {
        diferencias[campo] = {
          [`anio_${anio1}`]: val1,
          [`anio_${anio2}`]: val2,
        };
      }
    });

    return {
      marcadorId,
      anio1,
      anio2,
      diferencias,
      datos_anio1: datos1.marcador,
      datos_anio2: datos2.marcador,
    };
  }
}