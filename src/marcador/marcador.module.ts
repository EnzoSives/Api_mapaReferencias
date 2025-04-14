import { Module } from '@nestjs/common';
import { MarcadorService } from './marcador.service';
import { MarcadorController } from './marcador.controller';
import { Marcador } from './entities/marcador.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Marcador])],
  controllers: [MarcadorController],
  providers: [MarcadorService]
})
export class MarcadorModule {}
