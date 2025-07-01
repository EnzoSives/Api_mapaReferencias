import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Marcador } from '../../marcador/entities/marcador.entity';
import { IntegranteFamilia } from 'src/integrante_familiar/entities/integrante_familiar.entity';

@Entity()
export class Ocupacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo_principal: string;

  @Column()
  tipo_1: string;

  @Column()
  tipo_2: string;

  @Column({nullable: true})
  ingresos: number;

  @ManyToOne(() => Marcador, (marcador) => marcador.ocupaciones, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  marcador: Marcador;

  @ManyToOne(() => IntegranteFamilia, (integrante) => integrante.ocupaciones, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  integrante: IntegranteFamilia;
}