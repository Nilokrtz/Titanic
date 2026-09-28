import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TentativasSalaService } from './tentativas_sala.service.js';
import { CreateTentativasSalaDto } from './dto/create-tentativas_sala.dto.js';
import { UpdateTentativasSalaDto } from './dto/update-tentativas_sala.dto.js';

@Controller('tentativas-sala')
export class TentativasSalaController {
  constructor(private readonly tentativasSalaService: TentativasSalaService) {}

  @Post()
  create(@Body() createTentativasSalaDto: CreateTentativasSalaDto) {
    return this.tentativasSalaService.create(createTentativasSalaDto);
  }

  @Get()
  findAll() {
    return this.tentativasSalaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tentativasSalaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTentativasSalaDto: UpdateTentativasSalaDto) {
    return this.tentativasSalaService.update(+id, updateTentativasSalaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tentativasSalaService.remove(+id);
  }
}
