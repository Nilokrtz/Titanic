import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {ApiBadRequestResponse,ApiBearerAuth,ApiCreatedResponse,ApiForbiddenResponse,ApiNotFoundResponse,ApiOperation,ApiTags,ApiUnauthorizedResponse} from '@nestjs/swagger';
import { tipo_perfil } from '../generated/prisma/client.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { QuizQuestoesService } from './quiz_questoes.service.js';
import { CreateQuizQuestoesDto } from './dto/create-quiz_questoes.dto.js';

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
}