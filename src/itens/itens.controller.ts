import { Controller, Get, Post, Body, Put,
         Param, Delete, Query, UseGuards,
          ParseIntPipe,
         } from '@nestjs/common';

import{ ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse,
        ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, 
         ApiParam, ApiTags, ApiUnauthorizedResponse, } from '@nestjs/swagger';

import { tipo_peril } from '../generated/prisma/client.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ItensService } from './itens.service.js';
import { ItemRespostaDto } from './dto/item-resposta.dto.js';
import { FindItensQueryDto } from './dto/find-itens-query.dto.js';
import { CreateItenDto } from './dto/create-iten.dto.js';
import { ListarItensRespostaDto } from './dto/listar-itens-resposta.dto.js';
import { UpdateItenDto } from './dto/update-iten.dto.js';

@ApiTags('Itens')
@Controller('itens')
export class ItensController {
  constructor(private readonly itensService: ItensService) {}

  @Post()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_peril.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cadastra um novo item na loja' })
  @ApiCreatedResponse({ type: ItemRespostaDto })
  @ApiBadRequestResponse({ description: 'Dados invalidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissao.' })

  create(
    @Body() createItenDto: CreateItenDto) {
    return this.itensService.create(createItenDto);
  }

  @Get()
   @ApiOperation({ summary: 'Lista itens da loja com paginacao e filtros' })
   @ApiOkResponse({ type: ListarItensRespostaDto }) 
   @ApiBadRequestResponse({ description: 'Filtros invalidos.' }) 
  findAll(@Query() filtros: FindItensQueryDto) {
    return this.itensService.findAll(filtros);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Consulta um item pelo ID' })
  @ApiParam({ name: 'id', type: Number }) 
  @ApiOkResponse({ type: ItemRespostaDto })
  @ApiNotFoundResponse({ description: 'Item nao encontrado.' }) 
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itensService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_peril.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualiza dados de um item' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: ItemRespostaDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiNotFoundResponse({ description: 'Item não encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  update
  (@Param('id', ParseIntPipe) id: number, 
   @Body() updateItenDto: UpdateItenDto,
  ) {
    return this.itensService.update(id, updateItenDto);
  }

  @Delete(':id')
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_peril.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove um item da loja' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Item removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Item nao encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissao.' }) 
  
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itensService.remove(id);
  }
}
