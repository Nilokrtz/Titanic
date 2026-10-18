import {Controller,Post,Get,Put,Delete,Body,UseGuards, Param, ParseIntPipe, Query, Patch} from '@nestjs/common';
import { ApiBadRequestResponse,ApiBearerAuth,ApiCreatedResponse,ApiForbiddenResponse,ApiOperation,ApiTags,ApiUnauthorizedResponse,ApiOkResponse, ApiParam, ApiNotFoundResponse} from '@nestjs/swagger';
import { tipo_perfil } from '../generated/prisma/client.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { SalasDesafioService } from './salas_desafio.service.js';
import { CreateSalasDesafioDto } from './dto/create-salas_desafio.dto.js';
import { UpdateSalasDesafioDto } from './dto/update-salas_desafio.dto.js';
import { FindSalasQueryDto } from './dto/find-salas-query.dto.js';

@ApiTags('Salas Desafio')
@Controller('salas')
export class SalasDesafioController {
  constructor(private readonly salasDesafioService: SalasDesafioService) {}

  @Post()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cadastra uma nova sala de desafio' })
  @ApiCreatedResponse({ description: 'Sala cadastrada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou número da sala já existente.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  create(@Body() createDto: CreateSalasDesafioDto,
  ) {
    return this.salasDesafioService.create(createDto);
  }

  @Get()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lista todas as salas de desafio disponíveis' })
  @ApiOkResponse({ description: 'Lista de salas retornadas com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findAll(@Query() filtros: FindSalasQueryDto) {
    return this.salasDesafioService.findAll(filtros);
  }

  @Get(':id')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consulta as informações de uma sala pelo ID da mesma' })
  @ApiParam({name: 'id', type: Number, description: 'ID da sala de desafio'})
  @ApiOkResponse({ description: 'Sala de desafio encontrada' })
  @ApiNotFoundResponse({ description: 'Sala de desafio não encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findById(@Param('id', ParseIntPipe) id: number){
    return this.salasDesafioService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AutenticacaoGuard,RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualiza os dados de uma sala de desafio' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da sala de desafio' })
  @ApiOkResponse({ description: 'Sala atualizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou número da sala já pertencente a outra sala.' })
  @ApiNotFoundResponse({ description: 'Sala de desafio ou rank mínimo não encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateSalasDesafioDto) {
    return this.salasDesafioService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove uma sala de desafio' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da sala de desafio' })
  @ApiOkResponse({ description: 'Sala de desafio removida com sucesso.' })
  @ApiNotFoundResponse({ description: 'Sala de desafio não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salasDesafioService.remove(id);
  }
}