import { Module } from '@nestjs/common';
import { MarcadorService } from './marcador.service';
import { MarcadorController } from './marcador.controller';
import { Marcador } from './entities/marcador.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegranteFamilia } from '../integrante_familiar/entities/integrante_familiar.entity';
import { Programa } from 'src/programa/entities/programa.entity';
import { Estudio } from '../estudio/entities/estudio.entity';
import { Ocupacion } from '../ocupacion/entities/ocupacion.entity';
import { Vivienda } from '../vivienda/entities/vivienda.entity';
import { Servicio } from '../servicio/entities/servicio.entity';
import { Salud } from '../salud/entities/salud.entity';
import { MarcadorSubscriber } from './subscribers/marcador.subscriber';
import { MarcadorHistorial } from './entities/marcador-historial.entity';
import { MarcadorAnual } from './entities/marcador-anual.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marcador, MarcadorHistorial, MarcadorAnual, IntegranteFamilia, Programa, Estudio, Ocupacion, Vivienda, Servicio, Salud])],
  controllers: [MarcadorController],
  providers: [MarcadorService, MarcadorSubscriber],
  exports: [MarcadorService],
})
export class MarcadorModule {}
