import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { IntegranteFamilia } from '../../integrante_familiar/entities/integrante_familiar.entity';
import { Programa } from '../../programa/entities/programa.entity';
import { Estudio } from '../../estudio/entities/estudio.entity';
import { Ocupacion } from '../../ocupacion/entities/ocupacion.entity';
import { Vivienda } from '../../vivienda/entities/vivienda.entity';
import { Servicio } from '../../servicio/entities/servicio.entity';
import { Salud } from 'src/salud/entities/salud.entity';

@Entity()
export class Marcador {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ type: 'timestamp' })
  fechaCreacion: Date;

  @OneToMany(() => IntegranteFamilia, (integrante) => integrante.marcador, {
    cascade: true,
  })
  integrantes: IntegranteFamilia[];

  @OneToMany(() => Programa, (programa) => programa.marcador, {
    cascade: ['insert'],
  })
  programas: Programa[];

  @OneToMany(() => Estudio, (estudio) => estudio.marcador, {
    cascade: true,
  })
  estudios: Estudio[];

  @OneToMany(() => Ocupacion, (ocupacion) => ocupacion.marcador, {
    cascade: true,
  })
  ocupaciones: Ocupacion[];

  @OneToMany(() => Vivienda, (vivienda) => vivienda.marcador, {
    cascade: true,
  })
  viviendas: Vivienda[];

  @OneToMany(() => Servicio, (servicio) => servicio.marcador, {
    cascade: true,
  })
  servicios: Servicio[];

  @OneToMany(() => Salud, (salud) => salud.marcador, {
    cascade: true,
  })
  salud: Salud[];

  constructor(
    nombre: string,
    apellido: string,
    direccion: string,
    telefono: string,
    dni: string,
    barrio: string,
    tiempo_residencia: string,
    latitud: number,
    longitud: number,
    icono: string,
    notas?: string,
  ) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.direccion = direccion;
    this.telefono = telefono;
    this.dni = dni;
    this.barrio = barrio;
    this.tiempo_residencia = tiempo_residencia;
    this.latitud = latitud;
    this.longitud = longitud;
    this.icono = icono;
    this.notas = notas || null;
  }
}
