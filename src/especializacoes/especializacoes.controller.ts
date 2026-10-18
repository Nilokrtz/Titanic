import { Controller, Post, Get, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { tipo_perfil } from '../generated/prisma/client.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { EspecializacoesService } from './especializacoes.service.js';
import { CreateEspecializacoeDto } from './dto/create-especializacoes.dto.js';
import { UpdateEspecializacoeDto } from './dto/update-especializacoes.dto.js';
import { FindEspecializacoesQueryDto } from './dto/find-especializacoes-query.dto.js';

@ApiTags('Especializações')
@Controller('especializacoes')
export class EspecializacoesController {
  constructor(private readonly especializacoesService: EspecializacoesService) {}

  @Post()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cadastra uma nova especialização' })
  @ApiCreatedResponse({ description: 'Especialização cadastrada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou nome já existente.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  create(@Body() dados: CreateEspecializacoeDto) {
    return this.especializacoesService.create(dados);
  }

  @Get()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todas as especializações com paginação e filtros' })
  @ApiOkResponse({ description: 'Lista de especializações retornada com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findAll(@Query() query: FindEspecializacoesQueryDto) {
    return this.especializacoesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.especializacoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEspecializacoeDto: UpdateEspecializacoeDto) {
    return this.especializacoesService.update(+id, updateEspecializacoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.especializacoesService.remove(+id);
  }
}
