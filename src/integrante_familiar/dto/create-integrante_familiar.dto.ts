import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { CreateOcupacionDto } from 'src/ocupacion/dto/create-ocupacion.dto';
import { CreateSaludDto } from 'src/salud/dto/create-salud.dto';

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

  @IsString()
  @IsNotEmpty()
  vinculo: string;

  salud?: CreateSaludDto[];

  ocupaciones?: CreateOcupacionDto[];

  @IsInt()
  @IsNotEmpty()
  marcadorId: number; // ID del marcador al que pertenece
}
