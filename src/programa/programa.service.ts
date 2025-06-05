import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Programa } from './entities/programa.entity';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { Marcador } from '../marcador/entities/marcador.entity';

@Injectable()
export class ProgramaService {
  constructor(
    @InjectRepository(Programa)
    private readonly programaRepo: Repository<Programa>,

    @InjectRepository(Marcador)
    private readonly marcadorRepo: Repository<Marcador>,
  ) {}

  async create(dto: CreateProgramaDto): Promise<Programa> {
    const marcador = await this.marcadorRepo.findOneBy({ id: dto.marcadorId });
    if (!marcador) throw new NotFoundException('Marcador no encontrado');

    const programa = this.programaRepo.create({ ...dto, marcador });
    return this.programaRepo.save(programa);
  }

  findAll(): Promise<Programa[]> {
    return this.programaRepo.find({ relations: ['marcador'] });
  }

  findOne(id: number): Promise<Programa> {
    return this.programaRepo.findOne({
      where: { id },
      relations: ['marcador'],
    });
  }

  async update(id: number, dto: UpdateProgramaDto): Promise<Programa> {
    const programa = await this.programaRepo.findOneBy({ id });
    if (!programa) throw new NotFoundException('Programa no encontrado');

    Object.assign(programa, dto);
    return this.programaRepo.save(programa);
  }

  async remove(id: number): Promise<void> {
    const result = await this.programaRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Programa no encontrado');
  }
}
