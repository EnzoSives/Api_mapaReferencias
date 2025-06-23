import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salud } from './entities/salud.entity';
import { CreateSaludDto } from './dto/create-salud.dto';
import { UpdateSaludDto } from './dto/update-salud.dto';

@Injectable()
export class SaludService {
  constructor(
    @InjectRepository(Salud)
    private readonly repository: Repository<Salud>,
  ) {} 

  create(dto: CreateSaludDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find({ relations: ['marcador'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['marcador'] });
  }

  update(id: number, dto: UpdateSaludDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}