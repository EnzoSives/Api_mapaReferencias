import { PartialType } from '@nestjs/mapped-types';
import { CreateDelitoDto } from './create-delito.dto';

export class UpdateDelitoDto extends PartialType(CreateDelitoDto) {}
