import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RanksService } from './ranks.service.js';
import { CreateRankDto } from './dto/create-rank.dto.js';
import { UpdateRankDto } from './dto/update-rank.dto.js';
import { FindRanksQueryDto } from './dto/find-ranks-query.dto.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('Ranks')
@Controller('ranks')
export class RanksController {
  constructor(private readonly ranksService: RanksService) {}

  @Post()
  create(@Body() createRankDto: CreateRankDto) {
    return this.ranksService.create(createRankDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os ranks com paginação e filtros' })
  @ApiResponse({ status: 200, description: 'Lista de ranks retornada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Parâmetros de consulta inválidos.' })  
  findAll(@Query() query: FindRanksQueryDto) {
    return this.ranksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ranksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRankDto: UpdateRankDto) {
    return this.ranksService.update(+id, updateRankDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ranksService.remove(+id);
  }
}
