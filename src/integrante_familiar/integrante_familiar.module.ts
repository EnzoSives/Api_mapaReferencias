import { Module } from '@nestjs/common';
import { IntegranteFamiliaService } from '../integrante_familiar/integrante_familiar.service';
import { IntegranteFamiliaController } from './integrante_familiar.controller';
import { Marcador } from '../marcador/entities/marcador.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegranteFamilia } from '../integrante_familiar/entities/integrante_familiar.entity';
import { Salud } from 'src/salud/entities/salud.entity';
import { Ocupacion } from 'src/ocupacion/entities/ocupacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marcador, IntegranteFamilia, Salud, Ocupacion])],
  controllers: [IntegranteFamiliaController],
  providers: [IntegranteFamiliaService],
})
export class IntegranteFamiliarModule {}
