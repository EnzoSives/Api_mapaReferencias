import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { IntegranteFamiliaService } from '../integrante_familiar/integrante_familiar.service';
import { CreateIntegranteFamiliaDto } from '../integrante_familiar/dto/create-integrante_familiar.dto';
import { UpdateIntegranteFamiliarDto } from '../integrante_familiar/dto/update-integrante_familiar.dto';

@Controller('integrantes-familia')
export class IntegranteFamiliaController {
  constructor(private readonly service: IntegranteFamiliaService) {}

  @Post()
  create(@Body() dto: CreateIntegranteFamiliaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIntegranteFamiliarDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
