// create-marcador.dto.ts
import { CreateIntegranteFamiliaDto } from '../../integrante_familiar/dto/create-integrante_familiar.dto';

export class CreateMarcadorDto {
  nombreApellido: string;
  direccion: string;
  telefono: string;
  dni: string;
  notas?: string;
  ayudas?: string[];
  latitud: number;
  longitud: number;
  icono: string;
  integrantes: CreateIntegranteFamiliaDto[];
}
