import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarcadorSeg } from './entities/marcador-seg.entity';
import { CreateMarcadorSegDto } from './dto/create-marcador-seg.dto';
import { UpdateMarcadorSegDto } from './dto/update-marcador-seg.dto';

@Injectable()
export class MarcadorSegService {
  constructor(
    @InjectRepository(MarcadorSeg)
    private readonly repository: Repository<MarcadorSeg>,
  ) {}

  create(dto: CreateMarcadorSegDto) {
    const marcadorSeg = this.repository.create(dto);
    return this.repository.save(marcadorSeg);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, dto: UpdateMarcadorSegDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}