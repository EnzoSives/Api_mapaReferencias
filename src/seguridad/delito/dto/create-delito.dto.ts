import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDelitoDto {
  @IsString()
  @IsNotEmpty()
  articulo: string;

  @IsString()
  @IsNotEmpty()
  inciso: string;

  @IsString()
  @IsNotEmpty()
  tipoDelito: string;
}