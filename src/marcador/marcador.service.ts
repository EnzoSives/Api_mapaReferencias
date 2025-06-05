import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Marcador } from './entities/marcador.entity';
import { IntegranteFamilia } from '../integrante_familiar/entities/integrante_familiar.entity';
import { Repository } from 'typeorm';
import { Programa } from 'src/programa/entities/programa.entity';

@Injectable()
export class MarcadorService {
  constructor(
    @InjectRepository(Marcador)
    private marcadorRepo: Repository<Marcador>,

    @InjectRepository(IntegranteFamilia)
    private integranteRepo: Repository<IntegranteFamilia>, // 👈 agregado

    @InjectRepository(Programa)
    private programaRepo: Repository<Programa>,
  ) {}

  create(data: Partial<Marcador>) {
    const nuevo = this.marcadorRepo.create(data);
    return this.marcadorRepo.save(nuevo);
  }

  findAll() {
    return this.marcadorRepo.find({ relations: ['integrantes', 'programas'] });
  }

  findOne(id: number) {
    return this.marcadorRepo.findOne({
      where: { id },
      relations: ['integrantes', 'programas'],
    });
  }

  async update(id: number, data: Partial<Marcador>) {
    const marcador = await this.marcadorRepo.findOne({
      where: { id },
      relations: ['integrantes', 'programas'],
    });

    if (!marcador) {
      throw new NotFoundException('Marcador no encontrado');
    }

    const { integrantes, programas, ...resto } = data;

    // Actualiza campos simples
    Object.assign(marcador, resto);

    if (integrantes) {
      // Borra integrantes anteriores
      await this.integranteRepo.delete({ marcador: { id } });

      // Obtiene el marcador completo para asignar a los integrantes
      const marcadorCompleto = await this.marcadorRepo.findOne({ where: { id } });

      // Asocia los nuevos integrantes al marcador
      marcador.integrantes = integrantes.map((i) => ({
        ...i,
        marcador: marcadorCompleto,
      }));
    }

    if (programas) {
      // Borra programas anteriores
      await this.programaRepo.delete({ marcador: { id } });

      // Obtiene el marcador completo para asignar a los programas
      const marcadorCompleto = await this.marcadorRepo.findOne({ where: { id } });

      // Asocia los nuevos programas al marcador
      marcador.programas = programas.map((p) => ({
        ...p,
        marcador: marcadorCompleto,
      }));
    }

    return this.marcadorRepo.save(marcador);
  }

  remove(id: number) {
    return this.marcadorRepo.delete(id);
  }
}
