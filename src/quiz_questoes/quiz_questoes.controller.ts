import { Controller, Post,Get, Body, UseGuards, Query, ParseIntPipe, Param, Patch } from '@nestjs/common';
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
  @ApiOperation({ summary: 'Cadastra uma nova questão' })
  @ApiCreatedResponse({ description: 'Questão cadastrada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiNotFoundResponse({ description: 'Sala de desafio não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  create(@Body() createDto: CreateQuizQuestoesDto) {
    return this.quizQuestoesService.create(createDto);
  }

  @Get()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR, tipo_perfil.MONITOR, tipo_perfil.ALUNO)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lista questões com paginação e filtros' })
  @ApiOkResponse({ description: 'Lista paginada de questões retornada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Parâmetros de filtro ou paginação inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findAll(@Query() filtros: FindQuizQuestoesQueryDto) {
    return this.quizQuestoesService.findAll(filtros);
  }

  @Get(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR, tipo_perfil.MONITOR, tipo_perfil.ALUNO)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consulta os detalhes de uma questão pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da questão' })
  @ApiOkResponse({ description: 'Questão encontrada.' })
  @ApiNotFoundResponse({ description: 'Questão não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.quizQuestoesService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualiza dados de uma questão (Apenas Professores/Admins)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da questão' })
  @ApiOkResponse({ description: 'Questão atualizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiNotFoundResponse({ description: 'Questão ou Sala não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  update(@Param('id', ParseIntPipe) id: number,@Body() updateDto: UpdateQuizQuestoesDto) {
    return this.quizQuestoesService.update(id, updateDto);
  }
}