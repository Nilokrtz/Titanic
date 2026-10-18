import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { tipo_perfil } from '../generated/prisma/client.js';
import { PersonagensService } from './personagens.service.js';
import { CreatePersonagenDto } from './dto/create-personagen.dto.js';
import { ListarPersonagensDto } from './dto/listar-personagens.dto.js';
import { ListarPersonagensRespostaDto } from './dto/listar-personagens-resposta.dto.js';
import { PersonagemRespostaDto } from './dto/personagem-resposta.dto.js';
import { UpdatePersonagenDto } from './dto/update-personagen.dto.js';
import { ListarPersonagensMeDto } from './dto/listar-personagens-me.dto.js';

@ApiTags('Personagens')
@Controller('personagens')
export class PersonagensController {
  constructor(private readonly personagensService: PersonagensService) {}

  @Post()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Cria um personagem para o usuário autenticado',
  })
  @ApiCreatedResponse({
    description: 'Personagem criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Dados do personagem inválidos.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente ou inválido.',
  })
  @ApiNotFoundResponse({
    description: 'Especialização ou ranking inicial não encontrado.',
  })
  @ApiConflictResponse({
    description: 'Nome já cadastrado ou usuário já possui um personagem.',
  })
  create(
    @Body() createPersonagenDto: CreatePersonagenDto,
    @Req() requisicao: Request & { usuarioId: number },
  ) {
    return this.personagensService.create(
      createPersonagenDto,
      requisicao.usuarioId,
    );
  }

  @Get()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR, tipo_perfil.MONITOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lista personagens para o professor e o monitor' })
  @ApiOkResponse({ type: ListarPersonagensRespostaDto })
  @ApiBadRequestResponse({ description: 'Filtros ou paginação inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Apenas professor e monitor podem listar personagens.' })
  findAll(@Query() filtros: ListarPersonagensDto): Promise<ListarPersonagensRespostaDto> {
    return this.personagensService.findAll(filtros);
  }

  @Get('me')
@UseGuards(AutenticacaoGuard)
@ApiBearerAuth('JWT-auth')
@ApiOperation({
  summary: 'Lista personagens do usuário autenticado com filtros e paginação',
})
@ApiOkResponse({
  type: ListarPersonagensRespostaDto,
  description: 'Consulta realizada com sucesso.',
})
@ApiBadRequestResponse({
  description: 'Filtros ou paginação inválidos.',
})
@ApiUnauthorizedResponse({
  description: 'Token ausente, inválido ou expirado.',
})
findMe(
  @Query() filtros: ListarPersonagensMeDto,
  @Req() requisicao: Request & { usuarioId: number },
): Promise<ListarPersonagensRespostaDto> {
  return this.personagensService.findMe(
    requisicao.usuarioId,
    filtros,
  );
}

  @Get(':id')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consulta um personagem pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: PersonagemRespostaDto })
  @ApiBadRequestResponse({ description: 'ID inválido.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Sem permissão para consultar este personagem.' })
  @ApiNotFoundResponse({ description: 'Personagem não encontrado.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() requisicao: Request & { usuarioId: number },
  ): Promise<PersonagemRespostaDto> {
    return this.personagensService.findOne(id, requisicao.usuarioId);
  }

  @Patch(':id')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Altera o nome do próprio personagem' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: PersonagemRespostaDto })
  @ApiBadRequestResponse({ description: 'ID ou nome inválido.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Só o dono pode alterar este personagem.' })
  @ApiNotFoundResponse({ description: 'Personagem não encontrado.' })
  @ApiConflictResponse({ description: 'Nome de personagem já cadastrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() atualizacao: UpdatePersonagenDto,
    @Req() requisicao: Request & { usuarioId: number },
  ): Promise<PersonagemRespostaDto> {
    return this.personagensService.update(id, atualizacao, requisicao.usuarioId);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Exclui um personagem, seu inventário e suas tentativas' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Personagem excluído.' })
  @ApiBadRequestResponse({ description: 'ID inválido.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Apenas o professor pode excluir personagens.' })
  @ApiNotFoundResponse({ description: 'Personagem não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.personagensService.remove(id);
  }
}
