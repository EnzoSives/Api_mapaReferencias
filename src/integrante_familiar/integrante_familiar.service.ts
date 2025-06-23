import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegranteFamilia } from '../integrante_familiar/entities/integrante_familiar.entity';
import { CreateIntegranteFamiliaDto } from '../integrante_familiar/dto/create-integrante_familiar.dto';
import { UpdateIntegranteFamiliarDto } from '../integrante_familiar/dto/update-integrante_familiar.dto';
import { Marcador } from '../marcador/entities/marcador.entity';
import { Salud } from 'src/salud/entities/salud.entity';

@Injectable()
export class IntegranteFamiliaService {
  constructor(
    @InjectRepository(IntegranteFamilia)
    private readonly integranteRepo: Repository<IntegranteFamilia>,

    @InjectRepository(Marcador)
    private readonly marcadorRepo: Repository<Marcador>,
    @InjectRepository(Salud)
    private readonly saludRepo: Repository<Salud>,
  ) {}

  async create(dto: CreateIntegranteFamiliaDto): Promise<IntegranteFamilia> {
  const marcador = await this.marcadorRepo.findOneBy({ id: dto.marcadorId });
  if (!marcador) throw new NotFoundException('Marcador no encontrado');

  const { salud, ...resto } = dto;
  const integrante = this.integranteRepo.create({
    ...resto,
    marcador,
    salud: salud?.map((s) => ({ ...s })) || [],
  });

  return this.integranteRepo.save(integrante);
}


  findAll(): Promise<IntegranteFamilia[]> {
  return this.integranteRepo.find({
    relations: ['marcador', 'salud'], // 👈 agregado
  });
}

findOne(id: number): Promise<IntegranteFamilia> {
  return this.integranteRepo.findOne({
    where: { id },
    relations: ['marcador', 'salud'], // 👈 agregado
  });
}

async update(
  id: number,
  dto: UpdateIntegranteFamiliarDto,
): Promise<IntegranteFamilia> {
  const integrante = await this.integranteRepo.findOne({
    where: { id },
    relations: ['salud'], // 👈 importante
  });

  if (!integrante) throw new NotFoundException('Integrante no encontrado');

  const { salud, ...resto } = dto;
  Object.assign(integrante, resto);

  if (salud) {
    integrante.salud = salud.map((s) => this.saludRepo.create(s));

  }

  return this.integranteRepo.save(integrante);
}

  async remove(id: number): Promise<void> {
    const result = await this.integranteRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Integrante no encontrado');
  }
}
