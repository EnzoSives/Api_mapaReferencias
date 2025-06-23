import { IsInt, IsString} from 'class-validator';

export class CreateViviendaDto {
  @IsString()
  tipo: string;

  @IsString()
  dominio: string;

  @IsString()
  ambientes: string;

  @IsString()
  baño: string;

  @IsString()
  baño_opcion: string;

  @IsInt()
  marcadorId: number;

}