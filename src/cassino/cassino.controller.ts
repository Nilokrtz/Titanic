import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CassinoService } from './cassino.service.js';
import { CreateCassinoDto } from './dto/create-cassino.dto.js';
import { UpdateCassinoDto } from './dto/update-cassino.dto.js';

@Controller('cassino')
export class CassinoController {
  constructor(private readonly cassinoService: CassinoService) {}

  @Post()
  create(@Body() createCassinoDto: CreateCassinoDto) {
    return this.cassinoService.create(createCassinoDto);
  }

  @Get()
  findAll() {
    return this.cassinoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cassinoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCassinoDto: UpdateCassinoDto) {
    return this.cassinoService.update(+id, updateCassinoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cassinoService.remove(+id);
  }
}
