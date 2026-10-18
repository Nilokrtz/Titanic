import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { FindInventarioQueryDto } from './dto/find-inventario-query.dto.js';
import { ComprarItemDto } from './dto/comprar-item.dto.js';
import { VenderItemDto } from './dto/vender-item.dto.js';
import { UsarItemDto } from './dto/usar-item.dto.js';
import { InventarioItensService } from './inventario_itens.service.js';

@ApiTags('Inventário')
@Controller('personagens/:personagemId/inventario')
export class InventarioItensController {
  constructor(
    private readonly inventarioItensService: InventarioItensService,
  ) {}

  @Post('comprar')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Compra um item da loja e adiciona ao inventário do personagem',
  })
  @ApiParam({
    name: 'personagemId',
    type: Number,
    description: 'ID do personagem',
  })
  @ApiCreatedResponse({ description: 'Item comprado com sucesso.' })
  @ApiBadRequestResponse({
    description:
      'Saldo insuficiente de moedas, inventário cheio (máximo 2 itens na mão) ou dados inválidos.',
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({
    description: 'Apenas o dono do personagem pode realizar compras.',
  })
  @ApiNotFoundResponse({ description: 'Personagem ou item não encontrado.' })
  comprarItem(
    @Param('personagemId', ParseIntPipe) personagemId: number,
    @Body() comprarItemDto: ComprarItemDto,
    @Req() requisicao: Request & { usuarioId: number },
  ) {

    return this.inventarioItensService.comprarItem(
      personagemId,
      comprarItemDto,
      requisicao.usuarioId,
    );
  }

  @Post('vender')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Vende itens do próprio inventário com perda de 10% do valor original',
  })
  @ApiParam({
    name: 'personagemId',
    type: Number,
    description: 'ID do personagem',
  })
  @ApiOkResponse({ description: 'Item vendido com sucesso (reembolso de 90%).' })
  @ApiBadRequestResponse({
    description:
      'Quantidade insuficiente, dados inválidos ou item não comercializável.',
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({
    description: 'Apenas o dono do personagem pode vender seus itens.',
  })
  @ApiNotFoundResponse({
    description: 'Personagem ou item no inventário não encontrado.',
  })
  venderItem(
    @Param('personagemId', ParseIntPipe) personagemId: number,
    @Body() venderItemDto: VenderItemDto,
    @Req() requisicao: Request & { usuarioId: number },
  ) {

    return this.inventarioItensService.venderItem(
      personagemId,
      venderItemDto,
      requisicao.usuarioId,
    );
  }

  @Post(':id/usar')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Usa um item do próprio inventário aplicando seus efeitos',
  })
  @ApiParam({
    name: 'personagemId',
    type: Number,
    description: 'ID do personagem',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do registro no inventário ou ID do item',
  })
  @ApiOkResponse({ description: 'Item utilizado com sucesso.' })
  @ApiBadRequestResponse({
    description:
      'Personagem derrotado, uso de item proibido no Boss Final ou item não utilizável.',
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({
    description: 'Apenas o dono do personagem pode usar seus itens.',
  })
  @ApiNotFoundResponse({
    description: 'Personagem ou item não encontrado no inventário.',
  })
  usarItem(
    @Param('personagemId', ParseIntPipe) personagemId: number,
    @Param('id', ParseIntPipe) id: number,
    @Req() requisicao: Request & { usuarioId: number },
    @Body() usarItemDto?: UsarItemDto,
  ) {

    return this.inventarioItensService.usarItem(
      personagemId,
      id,
      requisicao.usuarioId,
      usarItemDto,
    );
  }

  @Get()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Lista os itens da mochila do personagem com paginação e filtros',
  })
  @ApiParam({ name: 'personagemId', type: Number })
  @ApiOkResponse({ description: 'Itens da mochila listados com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  listarMochila(
    @Param('personagemId', ParseIntPipe) personagemId: number,
    @Query() filtros: FindInventarioQueryDto,
  ) {
    return this.inventarioItensService.listarMochila(personagemId, filtros);
  }


  @Get(':id')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consulta um item especifico da mochila pelo ID' })
  @ApiParam({ name: 'personagemId', type: Number })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Item retornado com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido.' })
  @ApiNotFoundResponse({ description: 'Item nao encontrado no inventario.' })
  findOne(
    @Param('personagemId', ParseIntPipe) personagemId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
     return this.inventarioItensService.findOne(personagemId, id);
  }

  @Delete(':id')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Descarta voluntariamente uma unidade de item da mochila',
  })
  @ApiParam({ name: 'personagemId', type: Number })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Item descartado com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiNotFoundResponse({ description: 'Item não encontrado no inventário.' })
  descartarItem(
    @Param('personagemId', ParseIntPipe) personagemId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.inventarioItensService.descartarItem(personagemId, id);
  }
}
