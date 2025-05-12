import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateIntegranteFamiliaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsInt()
  edad: number;

  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsInt()
  @IsNotEmpty()
  marcadorId: number; // ID del marcador al que pertenece
}
