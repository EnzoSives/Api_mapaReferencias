// src/programa/entities/programa.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Marcador } from '../../marcador/entities/marcador.entity';

@Entity()
export class Programa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string;

  @Column()
  ayuda: string;

  @ManyToOne(() => Marcador, (marcador) => marcador.programas, {
    onDelete: 'CASCADE',
  })
  marcador: Marcador;
}
