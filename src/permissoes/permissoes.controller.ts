import { Controller, Post, Get, Put, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth } from '@nestjs/swagger';
import { tipo_perfil } from '../generated/prisma/client.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { PermissoesService } from './permissoes.service.js';
import { CreatePermissoeDto } from './dto/create-permissoe.dto.js';
import { FindPermissoesQueryDto } from './dto/find-permissoes-query.dto.js';
import { UpdatePermissoeDto } from './dto/update-permissoe.dto.js';

@ApiTags('Permissões')
@Controller('permissoes')
export class PermissoesController {
  constructor(private readonly permissoesService: PermissoesService) {}

  @Post()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cadastra uma nova permissão' })
  @ApiCreatedResponse({ description: 'Permissão cadastrada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou slug já existente.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  create(@Body() dados: CreatePermissoeDto) {
    return this.permissoesService.create(dados);
  }

  @Get()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todas as permissões com paginação e filtros' })
  @ApiOkResponse({ description: 'Lista de permissões retornada com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findAll(@Query() query: FindPermissoesQueryDto) {
    return this.permissoesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissoeDto: UpdatePermissoeDto) {
    return this.permissoesService.update(+id, updatePermissoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissoesService.remove(+id);
  }
}
