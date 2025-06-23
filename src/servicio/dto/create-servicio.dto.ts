import { IsInt, IsString} from 'class-validator';

export class CreateServicioDto {
  @IsString()
  nombre: string;

  @IsString()
  opcion_servicio: string;

  @IsInt()
  marcadorId: number;

}