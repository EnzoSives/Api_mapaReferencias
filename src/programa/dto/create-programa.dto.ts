// src/programa/dto/create-programa.dto.ts
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class CreateProgramaDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  tipo: string;

  @IsString()
  ayuda: string;

  @IsString()
  detalle: string;

  @IsString()
  notas?: string; // Opcional, si se desea incluir notas

  @IsString()
  mes?: string; // Opcional, 'enero', 'febrero', 'marzo', etc.

  @IsInt()
  cantidad?: number; // '1', '2', '3', etc. (cantidad de personas beneficiarias)

  @IsInt()
  @IsNotEmpty()
  marcadorId: number; // ID del marcador al que pertenece
}
