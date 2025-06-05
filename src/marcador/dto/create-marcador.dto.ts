// create-marcador.dto.ts
import { CreateProgramaDto } from 'src/programa/dto/create-programa.dto';
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
  programas?: CreateProgramaDto[]; // Opcional, si se desea incluir programas directamente
}
