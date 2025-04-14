import { Role } from "src/roles/rol.enum";

export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    rol: Role
  }
  
