import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Marcador } from '../../marcador/entities/marcador.entity';

@Entity()
export class Estudio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nivel: string;

  @ManyToOne(() => Marcador, (marcador) => marcador.estudios, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  marcador: Marcador;
}