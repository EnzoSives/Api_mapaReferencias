import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcadorSeg } from './entities/marcador-seg.entity';
import { MarcadorSegService } from './marcador-seg.service';
import { MarcadorSegController } from './marcador-seg.controller';
import { Delito } from '../delito/entities/delito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarcadorSeg, Delito])],
  providers: [MarcadorSegService],
  controllers: [MarcadorSegController],
})
export class MarcadorSegModule {}