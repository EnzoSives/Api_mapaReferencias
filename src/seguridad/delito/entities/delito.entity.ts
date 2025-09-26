import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MarcadorSeg } from '../../marcador-seg/entities/marcador-seg.entity';

@Entity()
export class Delito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  articulo: string;

  @Column()
  inciso: string;

  @Column()
  tipoDelito: string;

  @ManyToOne(() => MarcadorSeg, (marcador) => marcador.delitos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  marcadorSeg: MarcadorSeg;
}