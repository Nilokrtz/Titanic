import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Post,
  Delete
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { tipo_perfil } from '../generated/prisma/client.js';
import { PerfisService } from './perfis.service.js';
import { ListarPerfisDto } from './dto/listar-perfis.dto.js';
import { ListarPerfisRespostaDto } from './dto/listar-perfis-resposta.dto.js';
import { PerfilRespostaDto } from './dto/perfil-resposta.dto.js';
import { UpdatePerfiDto } from './dto/update-perfi.dto.js';
import { AdicionarPermissaoPerfilDto } from './dto/adicionar-permissao-perfil.dto.js';

@ApiTags('Perfis')
@Controller('perfis')
export class PerfisController {
  constructor(private readonly perfisService: PerfisService) {}

  @Get()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista perfis com paginação e filtros' })
  @ApiOkResponse({ type: ListarPerfisRespostaDto })
  @ApiBadRequestResponse({ description: 'Filtros ou paginação inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  findAll(
    @Query() filtros: ListarPerfisDto,
  ): Promise<ListarPerfisRespostaDto> {
    return this.perfisService.findAll(filtros);
  }

  @Get(':id')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consulta um perfil pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: PerfilRespostaDto })
  @ApiBadRequestResponse({ description: 'ID inválido.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiNotFoundResponse({ description: 'Perfil não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PerfilRespostaDto> {
    return this.perfisService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualiza a descrição de um perfil' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: PerfilRespostaDto })
  @ApiBadRequestResponse({ description: 'ID ou descrição inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({
    description: 'Apenas o professor pode atualizar perfis.',
  })
  @ApiNotFoundResponse({ description: 'Perfil não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() atualizacao: UpdatePerfiDto,
  ): Promise<PerfilRespostaDto> {
    return this.perfisService.update(id, atualizacao);
  }

  @Get(':id/permissoes')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lista as permissões associadas a um perfil' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do perfil', example: 1 })
  @ApiOkResponse({ description: 'Permissões do perfil retornadas com sucesso.' })
  @ApiNotFoundResponse({ description: 'Perfil não encontrado.' })
  listarPermissoesDoPerfil(@Param('id', ParseIntPipe) id: number) {
    return this.perfisService.listarPermissoes(id);
  }

  @Post(':id/permissoes')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Adiciona uma permissão a um perfil' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do perfil', example: 1 })
  @ApiCreatedResponse({ description: 'Permissão adicionada ao perfil com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Apenas o professor pode gerenciar permissões.' })
  @ApiNotFoundResponse({ description: 'Perfil ou permissão não encontrados.' })
  adicionarPermissao(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdicionarPermissaoPerfilDto,
  ) {
    return this.perfisService.adicionarPermissao(id, dto);
  }

  @Delete(':id/permissoes/:permissaoId')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove uma permissão de um perfil' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do perfil', example: 1 })
  @ApiParam({ name: 'permissaoId', type: Number, description: 'ID da permissão', example: 1 })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Apenas o professor pode gerenciar permissões.' })
  @ApiOkResponse({ description: 'Permissão removida do perfil com sucesso.' })
  @ApiNotFoundResponse({ description: 'Perfil ou Permissão não encontrada.' })
  removerPermissao(
    @Param('id', ParseIntPipe) id: number,
    @Param('permissaoId', ParseIntPipe) permissaoId: number,
  ) {
    return this.perfisService.removerPermissao(id, permissaoId);
  }
  
}
