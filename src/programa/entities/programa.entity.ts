// src/programa/entities/programa.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Marcador } from '../../marcador/entities/marcador.entity';

@Entity()
export class Programa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string;

  @Column()
  ayuda: string;

  @Column({ nullable: true })
  notas: string;

  @Column({ default: 'activo' }) // 'activo', 'inactivo', 'finalizado', 'suspendido'
  estado: string;

  @CreateDateColumn({ type: 'timestamp' })
  fechaInicio: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  fechaUltimaModificacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaFin: Date;

  @ManyToOne(() => Marcador, (marcador) => marcador.programas, {
    onDelete: 'CASCADE',
  })
  marcador: Marcador;

  constructor(
    tipo: string,
    ayuda: string,
    marcador: Marcador,
    estado?: string,
    notas?: string
  ) {
    this.tipo = tipo;
    this.ayuda = ayuda;
    this.marcador = marcador;
    this.estado = estado || 'activo';
    this.notas = notas || null;
  }
}