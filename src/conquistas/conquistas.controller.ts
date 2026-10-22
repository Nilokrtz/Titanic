import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConquistasService } from './conquistas.service.js';
import { CreateConquistaDto } from './dto/create-conquista.dto.js';
import { UpdateConquistaDto } from './dto/update-conquista.dto.js';

@Controller('conquistas')
export class ConquistasController {
  constructor(private readonly conquistasService: ConquistasService) {}

  @Post()
  create(@Body() createConquistaDto: CreateConquistaDto) {
    return this.conquistasService.create(createConquistaDto);
  }

  @Get()
  findAll() {
    return this.conquistasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conquistasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConquistaDto: UpdateConquistaDto) {
    return this.conquistasService.update(+id, updateConquistaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conquistasService.remove(+id);
  }
}
