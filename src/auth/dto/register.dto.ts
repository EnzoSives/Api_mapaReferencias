import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "src/roles/rol.enum";


export class RegisterDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;

  @IsOptional() // Opcional para permitir que el backend asigne un valor predeterminado
  @IsEnum(Role, { message: "El rol debe ser 'admin' o 'user'" }) // Validar que sea un rol válido
  rol?: Role; // Definido como opcional (puedes cambiarlo a obligatorio si lo prefieres)
}
