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

  @Column({ type: 'varchar', length: 1000, nullable: true })
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
  @Column({ type: 'json', nullable: true })
  integrantes_snapshot: any[];

  @Column({ type: 'json', nullable: true })
  programas_snapshot: any[];

  @Column({ type: 'json', nullable: true })
  estudios_snapshot: any[];

  @Column({ type: 'json', nullable: true })
  ocupaciones_snapshot: any[];

  @Column({ type: 'json', nullable: true })
  viviendas_snapshot: any[];

  @Column({ type: 'json', nullable: true })
  servicios_snapshot: any[];

  @Column({ type: 'json', nullable: true })
  salud_snapshot: any[];

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
      
      // Guardar snapshots de relaciones
      this.integrantes_snapshot = marcador.integrantes || [];
      this.programas_snapshot = marcador.programas || [];
      this.estudios_snapshot = marcador.estudios || [];
      this.ocupaciones_snapshot = marcador.ocupaciones || [];
      this.viviendas_snapshot = marcador.viviendas || [];
      this.servicios_snapshot = marcador.servicios || [];
      this.salud_snapshot = marcador.salud || [];
    }
  }
}