import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Marcador } from './marcador.entity';

@Entity('marcador_anual')
@Unique(['marcador', 'anio'])
export class MarcadorAnual {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Marcador, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'marcador_id' })
  marcador: Marcador;

  @Column()
  marcador_id: number;

  @Column()
  anio: number;

  // Snapshot de datos del marcador en ese año
  @Column({ nullable: true })
  nombre: string;

  @Column({ nullable: true })
  apellido: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  dni: string;

  @Column({ nullable: true })
  barrio: string;

  @Column({ nullable: true })
  tiempo_residencia: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  notas: string;

  @Column('double', { nullable: true })
  latitud: number;

  @Column('double', { nullable: true })
  longitud: number;

  @Column({ nullable: true })
  icono: string;

  // Snapshots de relaciones como JSON
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

  @CreateDateColumn({ type: 'timestamp' })
  fechaCreacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaCierre: Date;
}
