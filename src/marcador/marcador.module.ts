import { Module } from '@nestjs/common';
import { MarcadorService } from './marcador.service';
import { MarcadorController } from './marcador.controller';
import { Marcador } from './entities/marcador.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegranteFamilia } from '../integrante_familiar/entities/integrante_familiar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marcador, IntegranteFamilia])],
  controllers: [MarcadorController],
  providers: [MarcadorService],
})
export class MarcadorModule {}
