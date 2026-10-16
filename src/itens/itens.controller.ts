import { Controller, Get, Post, Body, Patch,
         Param, Delete, Query, UseGuards,
         ValidationPipe, ParseIntPipe, } from '@nestjs/common';

import{ ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse,
        ApiNotFoundResponse,ApiOkResponse, ApiOperation, 
         ApiParam, ApiTags, ApiUnauthorizedResponse, } from '@nestjs/swagger';

import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
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
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cadastra um novo item na loja' })
  @ApiCreatedResponse({ type: ItemRespostaDto })
  @ApiBadRequestResponse({ description: 'Dados invalidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido.' })
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true,        
  transform: true })) 
     createItenDto: CreateItenDto,
     ) {
    return this.itensService.create(createItenDto);
  }

  @Get()
   @ApiOperation({ summary: 'Lista itens da loja com paginacao e filtros' })
   @ApiOkResponse({ type: ListarItensRespostaDto }) 
   @ApiBadRequestResponse({ description: 'Filtros invalidos.' }) 
  findAll(
    @Query(new ValidationPipe({ transform: true, whitelist: true,
      forbidNonWhitelisted: true }))
      filtros: FindItensQueryDto,
  ) {
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItenDto: UpdateItenDto) {
    return this.itensService.update(+id, updateItenDto);
  }

  @Delete(':id')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove um item da loja' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Item removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Item nao encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itensService.remove(id);
  }
}
