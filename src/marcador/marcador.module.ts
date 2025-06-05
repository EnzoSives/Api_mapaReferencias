import { Module } from '@nestjs/common';
import { MarcadorService } from './marcador.service';
import { MarcadorController } from './marcador.controller';
import { Marcador } from './entities/marcador.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegranteFamilia } from '../integrante_familiar/entities/integrante_familiar.entity';
import { Programa } from 'src/programa/entities/programa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marcador, IntegranteFamilia, Programa])],
  controllers: [MarcadorController],
  providers: [MarcadorService],
})
export class MarcadorModule {}
