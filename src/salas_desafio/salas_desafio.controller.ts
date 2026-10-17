import {Controller,Post,Body,UseGuards} from '@nestjs/common';
import {ApiBadRequestResponse,ApiBearerAuth,ApiCreatedResponse,ApiForbiddenResponse,ApiOperation,ApiTags,ApiUnauthorizedResponse} from '@nestjs/swagger';
import { tipo_perfil } from '../generated/prisma/client.js';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { SalasDesafioService } from './salas_desafio.service.js';
import { CreateSalasDesafioDto } from './dto/create-salas_desafio.dto.js';

@ApiTags('Salas Desafio')
@Controller('salas')
export class SalasDesafioController {
  constructor(private readonly salasDesafioService: SalasDesafioService) {}

  @Post()
  @UseGuards(AutenticacaoGuard, RolesGuard)
  @Roles(tipo_perfil.ADMIN_PROFESSOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cadastra uma nova sala de desafio (Apenas Professores/Admins)' })
  @ApiCreatedResponse({ description: 'Sala cadastrada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou número da sala já existente.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso negado: Perfil sem permissão.' })
  create(@Body() createDto: CreateSalasDesafioDto,
  ) {
    return this.salasDesafioService.create(createDto);
  }
}