import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Marcador } from '../../marcador/entities/marcador.entity'; // Asegúrate que la ruta sea correcta
import { Salud } from 'src/salud/entities/salud.entity';
import { Ocupacion } from 'src/ocupacion/entities/ocupacion.entity';

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

  @Column()
  vinculo: string;

  @ManyToOne(() => Marcador, marcador => marcador.integrantes, { onDelete: 'CASCADE' })
  marcador: Marcador;

 @OneToMany(() => Salud, (salud) => salud.integrante, {
  cascade: true,
  eager: true,
  onDelete: 'CASCADE',
})
salud: Salud[];

@OneToMany(() => Ocupacion, (ocupacion) => ocupacion.integrante, {
  cascade: true,
  eager: true,
  onDelete: 'CASCADE',
})
ocupaciones: Ocupacion[]; // <- renombrado a plural


}
