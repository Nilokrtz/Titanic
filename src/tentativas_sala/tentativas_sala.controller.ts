import { Controller, Post, Body, UseGuards, Get,Patch, Query, ParseIntPipe, Param, Delete, Req } from '@nestjs/common';
import {ApiBadRequestResponse,ApiBearerAuth,ApiBody,ApiCreatedResponse,ApiNotFoundResponse,ApiOkResponse,ApiOperation,ApiParam,ApiTags,ApiUnauthorizedResponse,ApiForbiddenResponse} from '@nestjs/swagger';
import type { Request } from 'express';
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
  @ApiBody({
    schema: {
      type: 'object',
      required: ['sala_id', 'personagem_id'],
      properties: {
        sala_id: { type: 'integer', minimum: 1, example: 1 },
        personagem_id: { type: 'integer', minimum: 1, example: 1 },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Tentativa registrada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos, ranking insuficiente ou sala já concluída.' })
  @ApiNotFoundResponse({ description: 'Personagem ou Sala de desafio não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'O personagem não pertence ao usuário autenticado.' })
  create(
    @Body('sala_id', ParseIntPipe) salaId: number,
    @Body('personagem_id', ParseIntPipe) personagemId: number,
    @Req() requisicao: Request & { usuarioId: number },
  ) {
    return this.tentativasSalaService.create(salaId, personagemId, requisicao.usuarioId);
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

  @Patch(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualiza dados/status de uma tentativa' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da tentativa' })
  @ApiOkResponse({ description: 'Tentativa atualizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiNotFoundResponse({ description: 'Tentativa, Personagem ou Sala não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: CreateTentativasSalaDto) {
    return this.tentativasSalaService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove um registro de tentativa (Apenas Professores/Admins)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da tentativa' })
  @ApiOkResponse({ description: 'Tentativa removida com sucesso.' })
  @ApiNotFoundResponse({ description: 'Tentativa não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tentativasSalaService.remove(id);
  }

  @Get('personagem/:personagemId/flawless')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verifica se o personagem conquistou o Easter Egg de Zero Erros' })
  @ApiParam({ name: 'personagemId', type: Number, description: 'ID do personagem' })
  @ApiOkResponse({ description: 'Resultado do Easter Egg retornado com sucesso.' })
  verificarFlawless(@Param('personagemId', ParseIntPipe) personagemId: number) {
    return this.tentativasSalaService.verificarEasterEggFlawless(personagemId);
  }
}
