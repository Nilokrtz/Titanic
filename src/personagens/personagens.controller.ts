import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { tipo_perfil } from '../generated/prisma/client.js';
import { PersonagensService } from './personagens.service.js';
import { CreatePersonagenDto } from './dto/create-personagen.dto.js';
import { ListarPersonagensDto } from './dto/listar-personagens.dto.js';
import { ListarPersonagensRespostaDto } from './dto/listar-personagens-resposta.dto.js';
import { UpdatePersonagenDto } from './dto/update-personagen.dto.js';

@ApiTags('Personagens')
@Controller('personagens')
export class PersonagensController {
  constructor(private readonly personagensService: PersonagensService) {}

  @Post()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Cria um personagem para o usuário autenticado',
  })
  @ApiCreatedResponse({
    description: 'Personagem criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Dados do personagem inválidos.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente ou inválido.',
  })
  @ApiNotFoundResponse({
    description: 'Especialização ou ranking inicial não encontrado.',
  })
  @ApiConflictResponse({
    description: 'Nome já cadastrado ou usuário já possui um personagem.',
  })
  create(
    @Body() createPersonagenDto: CreatePersonagenDto,
    @Req() requisicao: Request & { usuarioId: number },
  ) {
    return this.personagensService.create(
      createPersonagenDto,
      requisicao.usuarioId,
    );
  }

  @Get()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR, tipo_perfil.MONITOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lista personagens para o professor e o monitor' })
  @ApiOkResponse({ type: ListarPersonagensRespostaDto })
  @ApiBadRequestResponse({ description: 'Filtros ou paginação inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Apenas professor e monitor podem listar personagens.' })
  findAll(@Query() filtros: ListarPersonagensDto): Promise<ListarPersonagensRespostaDto> {
    return this.personagensService.findAll(filtros);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personagensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonagenDto: UpdatePersonagenDto) {
    return this.personagensService.update(+id, updatePersonagenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personagensService.remove(+id);
  }
}
