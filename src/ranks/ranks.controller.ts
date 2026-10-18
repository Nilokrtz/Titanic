import { Controller, Post, Get, Put, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RanksService } from './ranks.service.js';
import { CreateRankDto } from './dto/create-rank.dto.js';
import { UpdateRankDto } from './dto/update-rank.dto.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiUnauthorizedResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { tipo_perfil } from '../generated/prisma/client.js'
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { FindRanksQueryDto } from './dto/find-ranks-query.dto.js';


@ApiTags('Ranks')
@Controller('ranks')
export class RanksController {
  constructor(private readonly ranksService: RanksService) {}

  @Post()
  //@UseGuards(AutenticacaoGuard, RolesGuard)
  //@Roles(tipo_perfil.ADMIN_PROFESSOR)
  //@ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cadastra um novo rank' })
  @ApiCreatedResponse({ description: 'Rank cadastrado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou nome/nivel/xp já existente.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  create(@Body() createRankDto: CreateRankDto) {
    return this.ranksService.create(createRankDto);
  }

  @Get()
  //@UseGuards(AutenticacaoGuard)
  //@ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todos os ranks com paginação e filtros' })
  @ApiOkResponse({ description: 'Lista de ranks retornada com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })  
  findAll(@Query() query: FindRanksQueryDto) {
    return this.ranksService.findAll(query);
  }

  @Get(':id')
  //@UseGuards(AutenticacaoGuard)
  //@ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter um rank pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do rank', example: 1 })
  @ApiOkResponse({ description: 'Rank retornado com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
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

