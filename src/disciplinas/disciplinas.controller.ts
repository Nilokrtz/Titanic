import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, 
  Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth,ApiCreatedResponse, 
  ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, 
  ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { tipo_perfil } from '../generated/prisma/client.js';
import { DisciplinasService } from './disciplinas.service.js';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto.js';
import { FindDisciplinasQueryDto } from './dto/find-disciplinas-query.dto.js';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto.js';

@ApiTags('Disciplinas')
@ApiBearerAuth('JWT-auth')
@Controller('disciplinas')
export class DisciplinasController {
  constructor(private readonly disciplinasService: DisciplinasService) {}

  @Post()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiOperation({ summary: 'Cadastra uma nova disciplina' })
  @ApiCreatedResponse({ description: 'Disciplina cadastrada com sucesso.' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou nome já cadastrado.',
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: perfil sem permissão.' })
  create(@Body() dados: CreateDisciplinaDto) {
    return this.disciplinasService.create(dados);
  }

  @Get()
  @UseGuards(AutenticacaoGuard)
  @ApiOperation({ summary: 'Lista as disciplinas com paginação e filtros' })
  @ApiOkResponse({ description: 'Lista de disciplinas retornada com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findAll(@Query() query: FindDisciplinasQueryDto) {
    return this.disciplinasService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AutenticacaoGuard)
  @ApiOperation({ summary: 'Obtém uma disciplina pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da disciplina',
    example: 1,
  })
  @ApiOkResponse({ description: 'Disciplina retornada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Disciplina não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.disciplinasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiOperation({ summary: 'Atualiza uma disciplina' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da disciplina',
    example: 1,
  })
  @ApiOkResponse({ description: 'Disciplina atualizada com sucesso.' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou nome já cadastrado.',
  })
  @ApiNotFoundResponse({ description: 'Disciplina não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: perfil sem permissão.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: UpdateDisciplinaDto,
  ) {
    return this.disciplinasService.update(id, dados);
  }

  @Delete(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiOperation({ summary: 'Remove uma disciplina sem salas vinculadas' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da disciplina',
    example: 1,
  })
  @ApiOkResponse({ description: 'Disciplina removida com sucesso.' })
  @ApiBadRequestResponse({
    description: 'A disciplina ainda está vinculada a uma sala.',
  })
  @ApiNotFoundResponse({ description: 'Disciplina não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: perfil sem permissão.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.disciplinasService.remove(id);
  }
}
