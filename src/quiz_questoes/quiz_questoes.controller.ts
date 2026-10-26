import { Controller, Post,Get, Body, UseGuards, Query, ParseIntPipe, Param, Patch, Delete } from '@nestjs/common';
import {ApiBadRequestResponse,ApiBearerAuth,ApiCreatedResponse,ApiForbiddenResponse,ApiNotFoundResponse,ApiOperation,ApiTags,ApiUnauthorizedResponse, ApiOkResponse, ApiParam} from '@nestjs/swagger';
import { tipo_perfil } from '../generated/prisma/client.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { QuizQuestoesService } from './quiz_questoes.service.js';
import { CreateQuizQuestoesDto } from './dto/create-quiz_questoes.dto.js';
import { UpdateQuizQuestoesDto } from './dto/update-quiz_questoes.dto.js';
import { FindQuizQuestoesQueryDto } from './dto/find-quiz-questoes-query.dto.js';

@ApiTags('Quiz Questões')
@Controller('questoes')
export class QuizQuestoesController {
  constructor(private readonly quizQuestoesService: QuizQuestoesService) {}

  @Post()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cadastra um novo quiz' })
  @ApiCreatedResponse({ description: 'Quiz cadastrado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiNotFoundResponse({ description: 'Sala de desafio não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  create(@Body() data: CreateQuizQuestoesDto) {
    return this.quizQuestoesService.create(data);
  }

  @Get()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR, tipo_perfil.MONITOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lista quizzes com paginação e filtros' })
  @ApiOkResponse({ description: 'Lista todos os quizzes' })
  @ApiBadRequestResponse({ description: 'Parâmetros de filtro ou paginação inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findAll(@Query() filtros: FindQuizQuestoesQueryDto) {
    return this.quizQuestoesService.findAll(filtros);
  }

  @Get(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR, tipo_perfil.MONITOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consulta os detalhes de um quiz pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do quiz' })
  @ApiOkResponse({ description: 'Quiz encontrado.' })
  @ApiNotFoundResponse({ description: 'Quiz não encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.quizQuestoesService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualiza dados de um quiz (Apenas Professores/Admins)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do quiz' })
  @ApiOkResponse({ description: 'Quiz atualizado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiNotFoundResponse({ description: 'Quiz ou Sala não encontrados.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  update(@Param('id', ParseIntPipe) id: number,@Body() data: UpdateQuizQuestoesDto) {
    return this.quizQuestoesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove um quiz' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do quiz' })
  @ApiOkResponse({ description: 'Quiz removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Quiz não encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizQuestoesService.remove(id);
  }

  @Get(':id/jogar')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Realzia a exlusao de uma opcao caso o usuário tenha proeficiencia na questão' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da questão' })
  @ApiOkResponse({ description: 'Questão é excluida caso o usuário tenha proeficiencia na questão.' })
  @ApiNotFoundResponse({ description: 'Questão não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  obterParaJogar(
  @Param('id', ParseIntPipe) id: number,@Query('especializacao') especializacao?: string) {
    return this.quizQuestoesService.ExclusãoDeOpcaoBaseadoNaProeficiencia(id, especializacao);
  }
}
