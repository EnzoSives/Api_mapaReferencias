import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { IntegranteFamilia } from '../../integrante_familiar/entities/integrante_familiar.entity';
import { Programa } from '../../programa/entities/programa.entity';

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

  // @Column({ type: 'simple-array', nullable: true })
  // ayudas: string[];

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
    cascade: ['insert'], // Solo permite insertar nuevos programas
    // Alternativa: remover cascade completamente
    // cascade: false,
  })
  programas: Programa[];

  constructor(
    nombreApellido: string,
    direccion: string,
    telefono: string,
    dni: string,
    latitud: number,
    longitud: number,
    icono: string,
    notas?: string,
    // ayudas?: string[]
  ) {
    this.nombreApellido = nombreApellido;
    this.direccion = direccion;
    this.telefono = telefono;
    this.dni = dni;
    this.latitud = latitud;
    this.longitud = longitud;
    this.icono = icono;
    this.notas = notas || null;
    // this.ayudas = ayudas || [];
  }
}
