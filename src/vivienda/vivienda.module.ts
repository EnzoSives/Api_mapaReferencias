import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vivienda } from './entities/vivienda.entity';
import { ViviendaService } from './vivienda.service';
import { ViviendaController } from './vivienda.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vivienda])],
  providers: [ViviendaService],
  controllers: [ViviendaController],
  exports: [ViviendaService],
})
export class ViviendaModule {}