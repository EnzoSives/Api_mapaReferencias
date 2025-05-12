import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IntegranteFamilia } from '../../integrante_familiar/entities/integrante_familiar.entity'; // Ajusta la ruta según tu estructura

@Entity()
export class Marcador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

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
    nombre: string,
    latitud: number,
    longitud: number,
    icono: string,
    descripcion?: string,
  ) {
    this.nombre = nombre;
    this.latitud = latitud;
    this.longitud = longitud;
    this.icono = icono;
    this.descripcion = descripcion || null;
  }
}
