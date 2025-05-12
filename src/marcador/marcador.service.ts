import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Marcador } from './entities/marcador.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MarcadorService {
  constructor(
    @InjectRepository(Marcador)
    private marcadorRepo: Repository<Marcador>,
  ) {}

  create(data: Partial<Marcador>) {
    const nuevo = this.marcadorRepo.create(data);
    return this.marcadorRepo.save(nuevo);
  }

  findAll() {
    return this.marcadorRepo.find({ relations: ['integrantes'] });
  }

  findOne(id: number) {
    return this.marcadorRepo.findOne({
      where: { id },
      relations: ['integrantes'],
    });
  }

  update(id: number, data: Partial<Marcador>) {
    return this.marcadorRepo.update(id, data);
  }

  remove(id: number) {
    return this.marcadorRepo.delete(id);
  }
}
