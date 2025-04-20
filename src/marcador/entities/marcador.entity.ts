import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
