// src/marcador/entities/marcador-historial.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('marcador_historial')
export class MarcadorHistorial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  marcador_id: number;

  @Column()
  nombre: string;
  
  @Column()
  apellido: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column()
  dni: string;

  @Column({ nullable: true })
  barrio: string;

  @Column({ nullable: true })
  tiempo_residencia: string;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column('double')
  latitud: number;

  @Column('double')
  longitud: number;

  @Column()
  icono: string;

  @Column({ type: 'timestamp' })
  fecha_creacion_original: Date;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_modificacion: Date;

  @Column({ default: 'UPDATE' })
  tipo_operacion: string; // UPDATE, DELETE

  // Campos para guardar snapshot de relaciones (como JSON)
  @Column({ type: 'mediumtext', nullable: true })
  integrantes_snapshot: string;

  @Column({ type: 'mediumtext', nullable: true })
  programas_snapshot: string;

  @Column({ type: 'mediumtext', nullable: true })
  estudios_snapshot: string;

  @Column({ type: 'mediumtext', nullable: true })
  ocupaciones_snapshot: string;

  @Column({ type: 'mediumtext', nullable: true })
  viviendas_snapshot: string;

  @Column({ type: 'mediumtext', nullable: true })
  servicios_snapshot: string;

  @Column({ type: 'mediumtext', nullable: true })
  salud_snapshot: string;

  constructor(marcador: any) {
    if (marcador) {
      this.marcador_id = marcador.id;
      this.nombre = marcador.nombre;
      this.apellido = marcador.apellido;
      this.direccion = marcador.direccion;
      this.telefono = marcador.telefono;
      this.dni = marcador.dni;
      this.barrio = marcador.barrio;
      this.tiempo_residencia = marcador.tiempo_residencia;
      this.notas = marcador.notas;
      this.latitud = marcador.latitud;
      this.longitud = marcador.longitud;
      this.icono = marcador.icono;
      this.fecha_creacion_original = marcador.fechaCreacion;
      
      // Guardar snapshots de relaciones como strings JSON
      this.integrantes_snapshot = JSON.stringify(marcador.integrantes || []);
      this.programas_snapshot = JSON.stringify(marcador.programas || []);
      this.estudios_snapshot = JSON.stringify(marcador.estudios || []);
      this.ocupaciones_snapshot = JSON.stringify(marcador.ocupaciones || []);
      this.viviendas_snapshot = JSON.stringify(marcador.viviendas || []);
      this.servicios_snapshot = JSON.stringify(marcador.servicios || []);
      this.salud_snapshot = JSON.stringify(marcador.salud || []);
    }
  }
}