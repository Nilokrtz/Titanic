import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tipo_perfil } from '../../generated/prisma/client.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

type AuthenticatedRequest = {
  user?: {
    id: number;
    email: string;
    perfil?: tipo_perfil;
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<tipo_perfil[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || !roles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    if (!user.perfil || !roles.includes(user.perfil)) {
      throw new ForbiddenException('Você não tem permissão para acessar esta rota.');
    }

    return true;
  }
}