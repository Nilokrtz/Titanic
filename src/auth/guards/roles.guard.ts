import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tipo_perfil } from '../../generated/prisma/client.js';
import { AuthRepository } from '../auth.repository.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

type AuthenticatedRequest = {
  usuarioId?: number;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly repository: AuthRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<tipo_perfil[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || !roles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.usuarioId) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    const usuario = await this.repository.buscarPerfil(request.usuarioId);

    if (!usuario) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    if (!usuario.perfis || !roles.includes(usuario.perfis.nome)) {
      throw new ForbiddenException('Você não tem permissão para acessar esta rota.');
    }

    return true;
  }
}
