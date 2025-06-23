import { IsInt, IsBoolean, IsString} from 'class-validator';

export class CreateSaludDto {
  @IsBoolean()
  cud: boolean;

  @IsBoolean()
  obra_social: boolean;

  @IsString()
  problema_salud: string;

  @IsInt()
  marcadorId: number;

}