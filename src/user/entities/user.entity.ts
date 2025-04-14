import { Role } from "src/roles/rol.enum";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  // Usar Enum para roles
  @Column({
    type: "enum",
    enum: Role,
    default: Role.User, // Valor predeterminado
  })
  rol: Role;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(name: string, password: string, email: string, rol: Role) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.rol = rol;
  }
}
