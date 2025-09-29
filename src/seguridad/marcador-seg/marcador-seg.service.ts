// src/seguridad/marcador-seg/marcador-seg.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarcadorSeg } from './entities/marcador-seg.entity';
import { CreateMarcadorSegDto } from './dto/create-marcador-seg.dto';
import { UpdateMarcadorSegDto } from './dto/update-marcador-seg.dto';
import { Delito } from '../delito/entities/delito.entity';

@Injectable()
export class MarcadorSegService {
  constructor(
    @InjectRepository(MarcadorSeg)
    private readonly repository: Repository<MarcadorSeg>,
    @InjectRepository(Delito)
    private readonly delitoRepository: Repository<Delito>,
  ) {}

  create(dto: CreateMarcadorSegDto) {
    const { delitos, ...marcadorData } = dto;
    const marcadorSeg = this.repository.create(marcadorData);
    if (delitos) {
      marcadorSeg.delitos = delitos.map(delitoDto => this.delitoRepository.create(delitoDto));
    }
    return this.repository.save(marcadorSeg);
  }

  findAll() {
    return this.repository.find({ relations: ['delitos'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['delitos'] });
  }

  async update(id: number, dto: UpdateMarcadorSegDto) {
    const marcador = await this.repository.findOne({ where: { id }, relations: ['delitos'] });
    if (!marcador) {
      throw new NotFoundException(`MarcadorSeg with ID ${id} not found`);
    }

    const { delitos, ...marcadorData } = dto;
    
    // Actualiza las propiedades del MarcadorSeg
    this.repository.merge(marcador, marcadorData);

    // Si se proporcionan delitos, los actualiza
    if (delitos) {
      // Elimina los delitos anteriores
      if (marcador.delitos) {
        await this.delitoRepository.remove(marcador.delitos);
      }
      // Agrega los nuevos delitos
      marcador.delitos = delitos.map(delitoDto => this.delitoRepository.create(delitoDto));
    }
    
    return this.repository.save(marcador);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}