import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { RanksService } from './ranks.service.js';
import { CreateRankDto } from './dto/create-rank.dto.js';
import { UpdateRankDto } from './dto/update-rank.dto.js';
import { FindRanksQueryDto } from './dto/find-ranks-query.dto.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Obter um rank pelo ID' })
  @ApiResponse({ status: 200, description: 'Rank retornado com sucesso.' })
  @ApiBadRequestResponse({ description: 'O ID informado deve ser um número inteiro.' })
  @ApiNotFoundResponse({ description: 'Rank não encontrado para o ID informado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ranksService.findOne(id);
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
