import {
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tipo_perfil } from '../../generated/prisma/client.js';
import { AuthRepository } from '../auth.repository.js';
import { RolesGuard } from './roles.guard.js';

describe('RolesGuard', () => {
  const buscarUsuario = vi.fn();
  const buscarRoles = vi.fn();
  const repository = { buscarPerfil: buscarUsuario } as unknown as AuthRepository;
  const reflector = {
    getAllAndOverride: buscarRoles,
  } as unknown as Reflector;
  const guard = new RolesGuard(reflector, repository);

  function contexto(usuarioId?: number): ExecutionContext {
    return {
      getHandler: () => null,
      getClass: () => null,
      switchToHttp: () => ({ getRequest: () => ({ usuarioId }) }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    buscarUsuario.mockReset();
    buscarRoles.mockReset();
    buscarRoles.mockReturnValue([tipo_perfil.ADMIN_PROFESSOR]);
  });

  it('permite ao professor acessar uma rota restrita', async () => {
    buscarUsuario.mockResolvedValueOnce({
      perfis: { nome: tipo_perfil.ADMIN_PROFESSOR },
    });

    await expect(guard.canActivate(contexto(1))).resolves.toBe(true);
    expect(buscarUsuario).toHaveBeenCalledWith(1);
  });

  it('rejeita requisição sem usuário autenticado', async () => {
    await expect(guard.canActivate(contexto())).rejects.toThrow(
      UnauthorizedException,
    );
    expect(buscarUsuario).not.toHaveBeenCalled();
  });

  it('rejeita sessão cujo usuário não existe', async () => {
    buscarUsuario.mockResolvedValueOnce(null);

    await expect(guard.canActivate(contexto(1))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejeita aluno em rota exclusiva do professor', async () => {
    buscarUsuario.mockResolvedValueOnce({ perfis: { nome: tipo_perfil.ALUNO } });

    await expect(guard.canActivate(contexto(2))).rejects.toThrow(
      ForbiddenException,
    );
  });
});
