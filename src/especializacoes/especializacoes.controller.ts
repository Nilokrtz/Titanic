import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EspecializacoesService } from './especializacoes.service.js';
import { CreateEspecializacoeDto } from './dto/create-especializacoe.dto.js';
import { UpdateEspecializacoeDto } from './dto/update-especializacoe.dto.js';

@Controller('especializacoes')
export class EspecializacoesController {
  constructor(private readonly especializacoesService: EspecializacoesService) {}

  @Post()
  create(@Body() createEspecializacoeDto: CreateEspecializacoeDto) {
    return this.especializacoesService.create(createEspecializacoeDto);
  }

  @Get()
  findAll() {
    return this.especializacoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.especializacoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEspecializacoeDto: UpdateEspecializacoeDto) {
    return this.especializacoesService.update(+id, updateEspecializacoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.especializacoesService.remove(+id);
  }
}
