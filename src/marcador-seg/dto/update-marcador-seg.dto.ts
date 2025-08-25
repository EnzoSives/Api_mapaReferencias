import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcadorSegDto } from './create-marcador-seg.dto';

export class UpdateMarcadorSegDto extends PartialType(CreateMarcadorSegDto) {}
