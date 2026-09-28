import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalasDesafioService } from './salas_desafio.service.js';
import { CreateSalasDesafioDto } from './dto/create-salas_desafio.dto.js';
import { UpdateSalasDesafioDto } from './dto/update-salas_desafio.dto.js';

@Controller('salas-desafio')
export class SalasDesafioController {
  constructor(private readonly salasDesafioService: SalasDesafioService) {}

  @Post()
  create(@Body() createSalasDesafioDto: CreateSalasDesafioDto) {
    return this.salasDesafioService.create(createSalasDesafioDto);
  }

  @Get()
  findAll() {
    return this.salasDesafioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salasDesafioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalasDesafioDto: UpdateSalasDesafioDto) {
    return this.salasDesafioService.update(+id, updateSalasDesafioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salasDesafioService.remove(+id);
  }
}
