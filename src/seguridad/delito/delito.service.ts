import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delito } from './entities/delito.entity';
import { CreateDelitoDto } from './dto/create-delito.dto';
import { UpdateDelitoDto } from './dto/update-delito.dto';

@Injectable()
export class DelitoService {
  constructor(
    @InjectRepository(Delito)
    private readonly repository: Repository<Delito>,
  ) {}

  create(dto: CreateDelitoDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find({ relations: ['marcadorSeg'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['marcadorSeg'] });
  }

  update(id: number, dto: UpdateDelitoDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}