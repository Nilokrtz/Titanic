import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe,  } from '@nestjs/common';
import { ConquistasService } from './conquistas.service.js';
import { CreateConquistaDto } from './dto/create-conquista.dto.js';
import { UpdateConquistaDto } from './dto/update-conquista.dto.js';
import { FindConquistasQueryDto } from './dto/find-conquistas-query.dto.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse, ApiTags, ApiCreatedResponse, ApiBadRequestResponse, ApiForbiddenResponse, } from '@nestjs/swagger';
import { tipo_perfil } from '../generated/prisma/client.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('Conquistas')
@Controller('conquistas')
export class ConquistasController {
  constructor(private readonly conquistasService: ConquistasService) {}

  @Post()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: 'Cadastrar uma nova conquista'})
  @ApiCreatedResponse({description: 'conquista cadastrada com sucesso'})
  @ApiBadRequestResponse({description: 'Dados inválidos ou conquista já existente'})
  @ApiUnauthorizedResponse({description: 'Token ausente ou inválido'})
  @ApiForbiddenResponse({description: 'Perfil sem permissão'})
  create(@Body() createConquistaDto: CreateConquistaDto) {
    return this.conquistasService.create(createConquistaDto);
  }

  @Get()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todas as conquistas com paginação e filtros' })
  @ApiOkResponse({ description: 'Lista de conquistas retornada com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  async findAll(@Query() query: FindConquistasQueryDto) {
    return await this.conquistasService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter uma conquista pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da conquista', example: 1 })
  @ApiOkResponse({ description: 'Conquista retornada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Conquista não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.conquistasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: 'Atualizar os dados de uma conquista'})
  @ApiParam({ name: 'id', type: Number, description: 'ID da conquista', example: 1 })
  @ApiOkResponse({description: 'conquista atualizada com sucesso'})
  @ApiBadRequestResponse({description: 'Dados inválidos'})
  @ApiUnauthorizedResponse({description: 'Token ausente ou inválido'})
  @ApiForbiddenResponse({description: 'Perfil sem permissão'})
  @ApiNotFoundResponse({description: 'Conquista não encontrada para o ID informado'})
  update(@Param('id') id: string, @Body() updateConquistaDto: UpdateConquistaDto) {
    return this.conquistasService.update(+id, updateConquistaDto);
  }

  @Delete(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary: 'Deletar uma conquista'})
  @ApiParam({ name: 'id', type: Number, description: 'ID da conquista', example: 1 })
  @ApiOkResponse({description: 'conquista removida com sucesso'})
  @ApiUnauthorizedResponse({description: 'Token ausente ou inválido'})
  @ApiForbiddenResponse({description: 'Perfil sem permissão'})
  @ApiNotFoundResponse({description: 'Conquista não encontrada para o ID informado'})
  remove(@Param('id') id: string) {
    return this.conquistasService.remove(+id);
}

@Get('progresso/:personagemId')
@UseGuards(AutenticacaoGuard)
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'Consultar progresso automático de conquistas do personagem' })
@ApiParam({ name: 'personagemId', type: Number, description: 'ID do personagem', example: 1 })
@ApiOkResponse({description: 'Progresso do personagem retornado com sucesso'})
@ApiBadRequestResponse({description: 'Personagem não encontrado'})
@ApiUnauthorizedResponse({description: 'Token ausente ou inválido'})
 async verificarProgresso(@Param('personagemId', ParseIntPipe) personagemId: number) {
  return await this.conquistasService.verificarProgresso(personagemId);
}
}