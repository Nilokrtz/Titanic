import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {ApiBadRequestResponse,ApiBearerAuth,ApiCreatedResponse,ApiNotFoundResponse,ApiOperation,ApiTags,ApiUnauthorizedResponse} from '@nestjs/swagger';
import { AutenticacaoGuard } from '../auth/guards/autenticacao.guard.js';
import { TentativasSalaService } from './tentativas_sala.service.js';
import { CreateTentativasSalaDto } from './dto/create-tentativas_sala.dto.js';

@ApiTags('Tentativas Sala')
@Controller('tentativas')
export class TentativasSalaController {
  constructor(private readonly tentativasSalaService: TentativasSalaService) {}

  @Post()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Registra/inicia uma nova tentativa em uma sala' })
  @ApiCreatedResponse({ description: 'Tentativa registrada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiNotFoundResponse({ description: 'Personagem ou Sala de desafio não encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  create(@Body() createDto: CreateTentativasSalaDto) {
    return this.tentativasSalaService.create(createDto);
  }
}