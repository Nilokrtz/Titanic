import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { AlterarSenhaDto } from './dto/alterar-senha.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { LoginRespostaDto } from './dto/login-resposta.dto.js';
import { MeRespostaDto } from './dto/me-resposta.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { RegistrarDto } from './dto/registrar.dto.js';
import { RegistrarRespostaDto } from './dto/registrar-resposta.dto.js';
import { AutenticacaoGuard } from './guards/autenticacao.guard.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registrar')
  @ApiOperation({ summary: 'Cadastra um aluno' })
  @ApiCreatedResponse({ type: RegistrarRespostaDto })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou campo não permitido.',
  })
  @ApiConflictResponse({ description: 'Email já cadastrado.' })
  registrar(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    registro: RegistrarDto,
  ): Promise<RegistrarRespostaDto> {
    return this.authService.registrar(registro);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Entra com email e senha' })
  @ApiOkResponse({ type: LoginRespostaDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Email ou senha inválidos.' })
  login(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    credenciais: LoginDto,
  ): Promise<LoginRespostaDto> {
    return this.authService.login(credenciais);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Troca um refresh token por novos tokens' })
  @ApiOkResponse({ type: LoginRespostaDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({
    description: 'Refresh token inválido ou expirado.',
  })
  refresh(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    solicitacao: RefreshDto,
  ): Promise<LoginRespostaDto> {
    return this.authService.refresh(solicitacao);
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Invalida o refresh token do usuário autenticado' })
  @ApiNoContentResponse({ description: 'Refresh token invalidado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido.' })
  logout(@Req() requisicao: Request & { usuarioId: number }): Promise<void> {
    return this.authService.logout(requisicao.usuarioId);
  }

  @Put('senha')
  @HttpCode(204)
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Altera a senha do usuário autenticado' })
  @ApiNoContentResponse({ description: 'Senha alterada.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou senha repetida.' })
  @ApiUnauthorizedResponse({
    description: 'Token ou senha atual inválidos.',
  })
  alterarSenha(
    @Req() requisicao: Request & { usuarioId: number },
    @Body() alteracao: AlterarSenhaDto,
  ): Promise<void> {
    return this.authService.alterarSenha(requisicao.usuarioId, alteracao);
  }

  @Get('me')
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consulta o usuário autenticado' })
  @ApiOkResponse({ type: MeRespostaDto })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido ou expirado.',
  })
  me(
    @Req() requisicao: Request & { usuarioId: number },
  ): Promise<MeRespostaDto> {
    return this.authService.me(requisicao.usuarioId);
  }
}
