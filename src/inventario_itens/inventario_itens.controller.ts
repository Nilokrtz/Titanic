import { Controller, Get, ParseIntPipe, 
       Param, Delete, Query, UseGuards,
      } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse,
       ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse,
       } from '@nestjs/swagger';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { FindInventarioQueryDto } from './dto/find-inventario-query.dto.js';
import { InventarioItensService } from './inventario_itens.service.js';

@ApiTags('Inventário')
@Controller('personagens/:personagemId/inventario')
export class InventarioItensController {
  constructor(
    private readonly inventarioItensService: InventarioItensService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Lista os itens da mochila do personagem com paginação e filtros',
  })
  @ApiParam({ name: 'personagemId', type: Number })
  listarMochila(
    @Param('personagemId', ParseIntPipe) personagemId: number,
    @Query() filtros: FindInventarioQueryDto,
  ) {
    return this.inventarioItensService.listarMochila(personagemId, filtros);
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
