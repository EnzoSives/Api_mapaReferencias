import { IsInt, IsString} from 'class-validator';

export class CreateOcupacionDto {
  @IsString()
  tipo_principal: string;

  @IsString()
  tipo_1: string;

  @IsString()
  tipo_2: string;

  @IsInt()
  ingresos: number;

  @IsInt()
  marcadorId: number;

}