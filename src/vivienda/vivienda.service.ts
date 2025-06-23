import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vivienda } from './entities/vivienda.entity';
import { CreateViviendaDto } from './dto/create-vivienda.dto';
import { UpdateViviendaDto } from './dto/update-vivienda.dto';

@Injectable()
export class ViviendaService {
  constructor(
    @InjectRepository(Vivienda)
    private readonly repository: Repository<Vivienda>,
  ) {} 

  create(dto: CreateViviendaDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find({ relations: ['marcador'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['marcador'] });
  }

  update(id: number, dto: UpdateViviendaDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}