import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItensService } from './itens.service.js';
import { CreateItenDto } from './dto/create-iten.dto.js';
import { UpdateItenDto } from './dto/update-iten.dto.js';

@Controller('itens')
export class ItensController {
  constructor(private readonly itensService: ItensService) {}

  @Post()
  create(@Body() createItenDto: CreateItenDto) {
    return this.itensService.create(createItenDto);
  }

  @Get()
  findAll() {
    return this.itensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItenDto: UpdateItenDto) {
    return this.itensService.update(+id, updateItenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itensService.remove(+id);
  }
}
