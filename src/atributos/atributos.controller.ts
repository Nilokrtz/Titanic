import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AtributosService } from './atributos.service.js';
import { CreateAtributoDto } from './dto/create-atributo.dto.js';
import { UpdateAtributoDto } from './dto/update-atributo.dto.js';

@Controller('atributos')
export class AtributosController {
  constructor(private readonly atributosService: AtributosService) {}

  @Post()
  create(@Body() createAtributoDto: CreateAtributoDto) {
    return this.atributosService.create(createAtributoDto);
  }

  @Get()
  findAll() {
    return this.atributosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atributosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAtributoDto: UpdateAtributoDto) {
    return this.atributosService.update(+id, updateAtributoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atributosService.remove(+id);
  }
}
