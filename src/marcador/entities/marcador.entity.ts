import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IntegranteFamilia } from '../../integrante_familiar/entities/integrante_familiar.entity';

@Entity()
export class Marcador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreApellido: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column()
  dni: string;

  @Column({ nullable: true })
  notas: string;

  @Column({ type: 'simple-array', nullable: true })
  ayudas: string[];

  @Column('double')
  latitud: number;

  @Column('double')
  longitud: number;

  @Column()
  icono: string;

  @OneToMany(() => IntegranteFamilia, (integrante) => integrante.marcador, {
    cascade: true,
  })
  integrantes: IntegranteFamilia[];

  constructor(
    nombreApellido: string,
    direccion: string,
    telefono: string,
    dni: string,
    latitud: number,
    longitud: number,
    icono: string,
    notas?: string,
    ayudas?: string[]
  ) {
    this.nombreApellido = nombreApellido;
    this.direccion = direccion;
    this.telefono = telefono;
    this.dni = dni;
    this.latitud = latitud;
    this.longitud = longitud;
    this.icono = icono;
    this.notas = notas || null;
    this.ayudas = ayudas || [];
  }
}
