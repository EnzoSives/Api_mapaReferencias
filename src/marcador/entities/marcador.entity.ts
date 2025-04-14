import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Marcador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column('double')
  latitud: number;

  @Column('double')
  longitud: number;

  @Column()
  icono: string;
}
