import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcadorDto } from './create-marcador.dto';

export class UpdateMarcadorDto extends PartialType(CreateMarcadorDto) {}
