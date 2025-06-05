// src/programa/dto/create-programa.dto.ts
import { IsInt, IsNotEmpty, IsString } from 'class-validator';


export class CreateProgramaDto {
  @IsString()
  tipo: string;

  @IsString()
  ayuda: string;

  @IsInt()
  @IsNotEmpty()
  marcadorId: number; // ID del marcador al que pertenece
}
