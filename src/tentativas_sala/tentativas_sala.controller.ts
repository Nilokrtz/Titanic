import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { tipo_perfil } from '../generated/prisma/enums.js';
import { CreateTentativasSalaDto } from './dto/create-tentativas_sala.dto.js';
import { DesistirTentativaDto } from './dto/desistir-tentativas.dto.js';
import { FindTentativasQueryDto } from './dto/find-tentativas-query.dto.js';
import { ResponderTentativaDto } from './dto/responder-tentativa.dto.js';
import { TentativasSalaService } from './tentativas_sala.service.js';

@ApiTags('Tentativas Sala')
@Controller('tentativas')
export class TentativasSalaController {
  constructor(private readonly tentativasSalaService: TentativasSalaService) {}

  @Post()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Registra/inicia uma nova tentativa em uma sala' })
  @ApiBody({ type: CreateTentativasSalaDto })
  @ApiCreatedResponse({ description: 'Tentativa registrada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos, ranking insuficiente ou sala já concluída.' })
  @ApiNotFoundResponse({ description: 'Personagem ou Sala de desafio não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'O personagem não pertence ao usuário autenticado.' })
  create(@Body('sala_id', ParseIntPipe) salaId: number,@Body('personagem_id', ParseIntPipe) personagemId: number,@Req() requisicao: Request & { usuarioId: number },
  ) {
    return this.tentativasSalaService.create(salaId, personagemId, requisicao.usuarioId);
  }

  @Post(':id/responder')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Envia a resposta de uma questão e processa acerto/dano/morte' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da tentativa em andamento' })
  @ApiOkResponse({ description: 'Resposta processada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Tentativa encerrada, anti-spam ativo ou dados inválidos.' })
  @ApiNotFoundResponse({ description: 'Tentativa, Personagem ou Questão não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'O personagem não pertence ao usuário autenticado.' })
  responder(
    @Param('id', ParseIntPipe) tentativaId: number,
    @Body() dto: ResponderTentativaDto,
    @Req() requisicao: Request & { usuarioId: number },
  ) {
    return this.tentativasSalaService.responderQuestao(tentativaId, dto, requisicao.usuarioId);
  }

  @Post(':id/desistir')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Encerra a tentativa atual registrando derrota por desistência' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da tentativa em andamento' })
  @ApiOkResponse({ description: 'Desistência registrada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Tentativa já encerrada ou inválida.' })
  @ApiNotFoundResponse({ description: 'Tentativa ou Personagem não encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'O personagem não pertence ao usuário autenticado.' })
  desistir(@Param('id', ParseIntPipe) tentativaId: number,@Body() dto: DesistirTentativaDto,@Req() requisicao: Request & { usuarioId: number },
  ) {
    return this.tentativasSalaService.desistirTentativa(tentativaId, dto, requisicao.usuarioId);
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