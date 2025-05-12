import { PartialType } from '@nestjs/mapped-types';
import { CreateIntegranteFamiliaDto } from './create-integrante_familiar.dto';

export class UpdateIntegranteFamiliarDto extends PartialType(
  CreateIntegranteFamiliaDto,
) {}
