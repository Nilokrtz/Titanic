import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonagensService } from './personagens.service.js';
import { CreatePersonagenDto } from './dto/create-personagen.dto.js';
import { UpdatePersonagenDto } from './dto/update-personagen.dto.js';

@Controller('personagens')
export class PersonagensController {
  constructor(private readonly personagensService: PersonagensService) {}

  @Post()
  create(@Body() createPersonagenDto: CreatePersonagenDto) {
    return this.personagensService.create(createPersonagenDto);
  }

  @Get()
  findAll() {
    return this.personagensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personagensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonagenDto: UpdatePersonagenDto) {
    return this.personagensService.update(+id, updatePersonagenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personagensService.remove(+id);
  }
}
