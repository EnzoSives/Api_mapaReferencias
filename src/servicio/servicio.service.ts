import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Injectable()
export class ServicioService {
  constructor(
    @InjectRepository(Servicio)
    private readonly repository: Repository<Servicio>,
  ) {} 

  create(dto: CreateServicioDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find({ relations: ['marcador'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['marcador'] });
  }

  update(id: number, dto: UpdateServicioDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}