import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ocupacion } from './entities/ocupacion.entity';
import { OcupacionService } from './ocupacion.service';
import { OcupacionController } from './ocupacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ocupacion])],
  providers: [OcupacionService],
  controllers: [OcupacionController],
  exports: [OcupacionService],
})
export class OcupacionModule {}