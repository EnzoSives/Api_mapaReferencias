import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegranteFamilia } from '../integrante_familiar/entities/integrante_familiar.entity';
import { CreateIntegranteFamiliaDto } from '../integrante_familiar/dto/create-integrante_familiar.dto';
import { UpdateIntegranteFamiliarDto } from '../integrante_familiar/dto/update-integrante_familiar.dto';
import { Marcador } from '../marcador/entities/marcador.entity';

@Injectable()
export class IntegranteFamiliaService {
  constructor(
    @InjectRepository(IntegranteFamilia)
    private readonly integranteRepo: Repository<IntegranteFamilia>,

    @InjectRepository(Marcador)
    private readonly marcadorRepo: Repository<Marcador>,
  ) {}

  async create(dto: CreateIntegranteFamiliaDto): Promise<IntegranteFamilia> {
    const marcador = await this.marcadorRepo.findOneBy({ id: dto.marcadorId });
    if (!marcador) throw new NotFoundException('Marcador no encontrado');

    const integrante = this.integranteRepo.create({ ...dto, marcador });
    return this.integranteRepo.save(integrante);
  }

  findAll(): Promise<IntegranteFamilia[]> {
    return this.integranteRepo.find({ relations: ['marcador'] });
  }

  findOne(id: number): Promise<IntegranteFamilia> {
    return this.integranteRepo.findOne({
      where: { id },
      relations: ['marcador'],
    });
  }

  async update(
    id: number,
    dto: UpdateIntegranteFamiliarDto,
  ): Promise<IntegranteFamilia> {
    const integrante = await this.integranteRepo.findOneBy({ id });
    if (!integrante) throw new NotFoundException('Integrante no encontrado');

    Object.assign(integrante, dto);
    return this.integranteRepo.save(integrante);
  }

  async remove(id: number): Promise<void> {
    const result = await this.integranteRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Integrante no encontrado');
  }
}
