import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { PerfisService } from './perfis.service.js';
import { CreatePerfiDto } from './dto/create-perfi.dto.js';
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
  findAll() {
    return this.perfisService.findAll();
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePerfiDto: UpdatePerfiDto) {
    return this.perfisService.update(+id, updatePerfiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.perfisService.remove(+id);
  }
}
