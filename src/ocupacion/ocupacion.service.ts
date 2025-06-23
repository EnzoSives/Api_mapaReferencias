import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ocupacion } from './entities/ocupacion.entity';
import { CreateOcupacionDto } from './dto/create-ocupacion.dto';
import { UpdateOcupacionDto } from './dto/update-ocupacion.dto';

@Injectable()
export class OcupacionService {
  constructor(
    @InjectRepository(Ocupacion)
    private readonly repository: Repository<Ocupacion>,
  ) {} 

  create(dto: CreateOcupacionDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find({ relations: ['marcador'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['marcador'] });
  }

  update(id: number, dto: UpdateOcupacionDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}