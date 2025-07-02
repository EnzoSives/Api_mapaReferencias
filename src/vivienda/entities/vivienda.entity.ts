import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Marcador } from '../../marcador/entities/marcador.entity';

@Entity()
export class Vivienda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string;

  @Column()
  dominio: string;

  @Column()
  ambientes: string;

  @Column()
  baño: string;

  @Column()
  baño_opcion: string;

  @ManyToOne(() => Marcador, (marcador) => marcador.viviendas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  marcador: Marcador;
}
