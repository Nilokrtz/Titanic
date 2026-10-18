import { Controller, Post, Body, UseGuards, Get, Query, ParseIntPipe, Param } from '@nestjs/common';
import {ApiBadRequestResponse,ApiBearerAuth,ApiCreatedResponse,ApiNotFoundResponse,ApiOkResponse,ApiOperation,ApiParam,ApiTags,ApiUnauthorizedResponse} from '@nestjs/swagger';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { TentativasSalaService } from './tentativas_sala.service.js';
import { CreateTentativasSalaDto } from './dto/create-tentativas_sala.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { tipo_perfil } from '../generated/prisma/enums.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { FindTentativasQueryDto } from './dto/find-tentativas-query.dto.js';

@ApiTags('Tentativas Sala')
@Controller('tentativas')
export class TentativasSalaController {
  constructor(private readonly tentativasSalaService: TentativasSalaService) {}

  @Post()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Registra/inicia uma nova tentativa em uma sala' })
  @ApiCreatedResponse({ description: 'Tentativa registrada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiNotFoundResponse({ description: 'Personagem ou Sala de desafio não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  create(@Body() createDto: CreateTentativasSalaDto) {
    return this.tentativasSalaService.create(createDto);
  }

  @Get()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR, tipo_perfil.MONITOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lista o histórico de tentativas com paginação e filtros' })
  @ApiOkResponse({ description: 'Lista paginada de tentativas retornada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Parâmetros de filtro ou paginação inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findAll(@Query() filtros: FindTentativasQueryDto) {
    return this.tentativasSalaService.findAll(filtros);
  }

  @Get(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR, tipo_perfil.MONITOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consulta os detalhes de uma tentativa pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da tentativa' })
  @ApiOkResponse({ description: 'Tentativa encontrada.' })
  @ApiNotFoundResponse({ description: 'Tentativa não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.tentativasSalaService.findById(id);
  }
}