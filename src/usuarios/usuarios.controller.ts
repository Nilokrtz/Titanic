import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { tipo_perfil } from '../generated/prisma/client.js';
import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { ListarUsuariosDto } from './dto/listar-usuarios.dto.js';
import { ListarUsuariosRespostaDto } from './dto/listar-usuarios-resposta.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { UsuarioRespostaDto } from './dto/usuario-resposta.dto.js';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cadastra um usuário pelo professor' })
  @ApiCreatedResponse({ type: UsuarioRespostaDto })
  @ApiBadRequestResponse({ description: 'Dados do usuário inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({
    description: 'Apenas o professor pode cadastrar usuários.',
  })
  @ApiNotFoundResponse({ description: 'Perfil não encontrado.' })
  @ApiConflictResponse({ description: 'Email já cadastrado.' })
  create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<UsuarioRespostaDto> {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lista usuários para o professor' })
  @ApiOkResponse({ type: ListarUsuariosRespostaDto })
  @ApiBadRequestResponse({ description: 'Filtros ou paginação inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({
    description: 'Apenas o professor pode listar usuários.',
  })
  findAll(
    @Query() filtros: ListarUsuariosDto,
    @Req() requisicao: Request & { usuarioId: number },
  ): Promise<ListarUsuariosRespostaDto> {
    return this.usuariosService.findAll(filtros, requisicao.usuarioId);
  }

  @Get(':id')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consulta um usuário pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: UsuarioRespostaDto })
  @ApiBadRequestResponse({ description: 'ID inválido.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({
    description: 'Sem permissão para consultar este usuário.',
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() requisicao: Request & { usuarioId: number },
  ): Promise<UsuarioRespostaDto> {
    return this.usuariosService.findOne(id, requisicao.usuarioId);
  }

  @Put(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualiza um usuário pelo professor' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: UsuarioRespostaDto })
  @ApiBadRequestResponse({ description: 'ID ou dados do usuário inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({
    description: 'Apenas o professor pode atualizar usuários.',
  })
  @ApiNotFoundResponse({ description: 'Usuário ou perfil não encontrado.' })
  @ApiConflictResponse({ description: 'Email já cadastrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() atualizacao: UpdateUsuarioDto,
  ): Promise<UsuarioRespostaDto> {
    return this.usuariosService.update(id, atualizacao);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Exclui um usuário logicamente' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Usuário excluído.' })
  @ApiBadRequestResponse({ description: 'ID inválido.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({
    description: 'Apenas o professor pode excluir usuários.',
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usuariosService.remove(id);
  }
}
