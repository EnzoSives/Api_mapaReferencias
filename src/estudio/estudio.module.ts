import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudio } from './entities/estudio.entity';
import { EstudioService } from './estudio.service';
import { EstudioController } from './estudio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Estudio])],
  providers: [EstudioService],
  controllers: [EstudioController],
  exports: [EstudioService],
})
export class EstudioModule {}