import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudio } from './entities/estudio.entity';
import { CreateEstudioDto } from './dto/create-estudio.dto';
import { UpdateEstudioDto } from './dto/update-estudio.dto';

@Injectable()
export class EstudioService {
  constructor(
    @InjectRepository(Estudio)
    private readonly repository: Repository<Estudio>,
  ) {} 

  create(dto: CreateEstudioDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find({ relations: ['marcador'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['marcador'] });
  }

  update(id: number, dto: UpdateEstudioDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}