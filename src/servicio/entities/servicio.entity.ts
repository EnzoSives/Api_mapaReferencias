import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Marcador } from '../../marcador/entities/marcador.entity';

@Entity()
export class Servicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  opcion_servicio: string;

  @ManyToOne(() => Marcador, (marcador) => marcador.servicios, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  marcador: Marcador;
}
