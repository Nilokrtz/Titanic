import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ConquistasService } from './conquistas.service.js';
import { CreateConquistaDto } from './dto/create-conquista.dto.js';
import { UpdateConquistaDto } from './dto/update-conquista.dto.js';
import { FindConquistasQueryDto } from './dto/find-conquistas-query.dto.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('conquistas')
export class ConquistasController {
  constructor(private readonly conquistasService: ConquistasService) {}

  @Post()
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
  findOne(@Param('id') id: string) {
    return this.conquistasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConquistaDto: UpdateConquistaDto) {
    return this.conquistasService.update(+id, updateConquistaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conquistasService.remove(+id);
  }
}
