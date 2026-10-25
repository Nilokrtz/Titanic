import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { CassinoService } from './cassino.service.js';
import { CreateCassinoDto } from './dto/create-cassino.dto.js';
import { UpdateCassinoDto } from './dto/update-cassino.dto.js';
import { FindCassinoQueryDto } from './dto/find-cassino-query.dto.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { tipo_perfil } from '../generated/prisma/client.js';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth, ApiParam, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('Cassino')
@Controller('cassino')
export class CassinoController {
  constructor(private readonly cassinoService: CassinoService) {}

  @Post()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cadastrar uma nova opção de prêmio para o cassino'})
  @ApiCreatedResponse({ description: 'Nova opção do cassino cadastrada com sucesso'})
  @ApiBadRequestResponse({ description: 'Dados inválidos ou opção já existente'})
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido'})
  @ApiForbiddenResponse({ description: 'Perfil sem permissão'})
  create(@Body() createCassinoDto: CreateCassinoDto) {
    return this.cassinoService.create(createCassinoDto);
  }

  @Get()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar opções do cassino com paginação e filtros'})
  @ApiOkResponse({ description: 'Lista de opções retornada com sucesso'})
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido'})
  findAll(@Query() query: FindCassinoQueryDto) {
    return this.cassinoService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter uma opção do cassino pelo ID'})
  @ApiParam({ name: 'id', type: Number, description: 'ID da opção desejada', example: 1})
  @ApiOkResponse({ description: 'Opção do cassino retornada com sucesso'})
  @ApiNotFoundResponse({ description: 'Opção do cassino não encontrada'})
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido'})
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cassinoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCassinoDto: UpdateCassinoDto) {
    return this.cassinoService.update(+id, updateCassinoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cassinoService.remove(+id);
  }
}
