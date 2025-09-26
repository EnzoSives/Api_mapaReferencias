import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delito } from './entities/delito.entity';
import { DelitoService } from './delito.service';
import { DelitoController } from './delito.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Delito])],
  providers: [DelitoService],
  controllers: [DelitoController],
  exports: [DelitoService],
})
export class DelitoModule {}