import { Module } from '@nestjs/common';
import { ProgramaService } from './programa.service';
import { ProgramaController } from './programa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marcador } from 'src/marcador/entities/marcador.entity';
import { Programa } from './entities/programa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marcador, Programa])],
  controllers: [ProgramaController],
  providers: [ProgramaService]
})
export class ProgramaModule {}
