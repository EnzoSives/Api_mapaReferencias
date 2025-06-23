import { IsInt, IsString} from 'class-validator';

export class CreateEstudioDto {
  @IsString()
  nivel: string;

  @IsInt()
  marcadorId: number;

}