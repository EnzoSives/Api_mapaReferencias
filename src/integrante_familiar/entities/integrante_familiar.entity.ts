import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Marcador } from '../../marcador/entities/marcador.entity'; // Asegúrate que la ruta sea correcta

@Entity()
export class IntegranteFamilia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ nullable: true })
  edad: number | null;

  @Column()
  dni: string;

  @ManyToOne(() => Marcador, marcador => marcador.integrantes, { onDelete: 'CASCADE' })
  marcador: Marcador;
}
