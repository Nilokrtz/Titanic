import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { CreatePerfiDto } from './dto/create-perfi.dto.js';
import { ListarPerfisDto } from './dto/listar-perfis.dto.js';
import { ListarPerfisRespostaDto } from './dto/listar-perfis-resposta.dto.js';
import { PerfilRespostaDto } from './dto/perfil-resposta.dto.js';
import { UpdatePerfiDto } from './dto/update-perfi.dto.js';

@ApiTags('Perfis')
@Controller('perfis')
export class PerfisController {
  constructor(private readonly perfisService: PerfisService) {}

  @Post()
  create(@Body() createPerfiDto: CreatePerfiDto) {
    return this.perfisService.create(createPerfiDto);
  }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.perfisService.remove(+id);
  }
}
