import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Marcador } from '../../marcador/entities/marcador.entity';
import { IntegranteFamilia } from 'src/integrante_familiar/entities/integrante_familiar.entity';

@Entity()
export class Salud {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean' })
  cud: boolean;

  @Column({ type: 'boolean' })
  obra_social: boolean;

  @Column()
  problema_salud: string;

  @ManyToOne(() => Marcador, (marcador) => marcador.salud, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  marcador: Marcador;

@ManyToOne(() => IntegranteFamilia, (integrante) => integrante.salud, {
  onDelete: 'CASCADE',
})
integrante: IntegranteFamilia;

}