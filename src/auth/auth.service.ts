import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'node:crypto';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegistrarDto } from './dto/registrar.dto.js';
import { RegistrarRespostaDto } from './dto/registrar-resposta.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { LoginRespostaDto } from './dto/login-resposta.dto.js';
import { MeRespostaDto } from './dto/me-resposta.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { SenhasService } from './senhas.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly senhasService: SenhasService,
    private readonly jwtService: JwtService,
  ) {}

  async registrar(registro: RegistrarDto): Promise<RegistrarRespostaDto> {
    const perfilAluno = await this.prisma.perfis.findUnique({
      where: { nome: 'ALUNO' },
      select: { id: true },
    });

    if (!perfilAluno) {
      throw new InternalServerErrorException('Perfil ALUNO não configurado.');
    }

    const email = registro.email.trim().toLowerCase();
    const hashSenha = await this.senhasService.gerarHash(registro.senha);

    try {
      const usuario = await this.prisma.usuarios.create({
        data: {
          email,
          senha: hashSenha,
          perfis: { connect: { id: perfilAluno.id } },
        },
        select: { id: true, email: true },
      });

      return { id: usuario.id, email: usuario.email, perfil: 'ALUNO' };
    } catch (erro) {
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        erro.code === 'P2002'
      ) {
        throw new ConflictException('Email já cadastrado.');
      }

      throw erro;
    }
  }

  async login(credenciais: LoginDto): Promise<LoginRespostaDto> {
    const email = credenciais.email.trim().toLowerCase();
    const usuario = await this.prisma.usuarios.findUnique({
      where: { email },
      select: { id: true, senha: true, excluido_em: true },
    });

    if (
      !usuario ||
      usuario.excluido_em ||
      !(await this.senhasService.conferirSenha(
        credenciais.senha,
        usuario.senha,
      ))
    ) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }

    const tokens = await this.gerarTokens(usuario.id);

    await this.prisma.usuarios.update({
      where: { id: usuario.id },
      data: { refresh_token_hash: this.hashToken(tokens.refresh_token) },
    });

    return tokens;
  }

  async refresh(solicitacao: RefreshDto): Promise<LoginRespostaDto> {
    let conteudo: { sub?: unknown; tipo?: unknown };

    try {
      conteudo = await this.jwtService.verifyAsync(solicitacao.refresh_token, {
        secret: this.segredoRefresh(),
        algorithms: ['HS256'],
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado.');
    }

    if (
      conteudo.tipo !== 'refresh' ||
      typeof conteudo.sub !== 'number' ||
      !Number.isInteger(conteudo.sub) ||
      conteudo.sub <= 0
    ) {
      throw new UnauthorizedException('Refresh token inválido.');
    }

    const novosTokens = await this.gerarTokens(conteudo.sub);
    const atualizacao = await this.prisma.usuarios.updateMany({
      where: {
        id: conteudo.sub,
        excluido_em: null,
        refresh_token_hash: this.hashToken(solicitacao.refresh_token),
      },
      data: { refresh_token_hash: this.hashToken(novosTokens.refresh_token) },
    });

    if (atualizacao.count !== 1) {
      throw new UnauthorizedException('Refresh token inválido.');
    }

    return novosTokens;
  }

  async me(usuarioId: number): Promise<MeRespostaDto> {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        email: true,
        excluido_em: true,
        perfis: { select: { nome: true } },
      },
    });

    if (!usuario || usuario.excluido_em) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      perfil: usuario.perfis?.nome ?? null,
    };
  }

  private async gerarTokens(usuarioId: number): Promise<LoginRespostaDto> {
    const accessToken = await this.jwtService.signAsync({ sub: usuarioId });
    const refreshToken = await this.jwtService.signAsync(
      { sub: usuarioId, tipo: 'refresh', jti: randomUUID() },
      { secret: this.segredoRefresh(), expiresIn: '7d', algorithm: 'HS256' },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 900,
      refresh_expires_in: 604800,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private segredoRefresh(): string {
    const segredo = process.env.JWT_REFRESH_SECRET;

    if (!segredo) {
      throw new InternalServerErrorException(
        'JWT_REFRESH_SECRET não configurada.',
      );
    }

    return segredo;
  }
}
