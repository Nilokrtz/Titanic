import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AuthRepository } from '../auth.repository.js';

@Injectable()
export class AutenticacaoGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly repository: AuthRepository,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const requisicao = contexto
      .switchToHttp()
      .getRequest<Request & { usuarioId?: number }>();
    const [tipo, token] = requisicao.headers.authorization?.split(' ') ?? [];

    if (tipo?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Token ausente ou inválido.');
    }

    let conteudo: { sub?: unknown };

    try {
      conteudo = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    if (
      typeof conteudo.sub !== 'number' ||
      !Number.isInteger(conteudo.sub) ||
      conteudo.sub <= 0
    ) {
      throw new UnauthorizedException('Token inválido.');
    }

    const usuario = await this.repository.buscarSessao(conteudo.sub);

    if (!usuario || usuario.excluido_em) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    requisicao.usuarioId = conteudo.sub;
    return true;
  }
}
