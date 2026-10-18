import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../auth.repository.js';
import { AutenticacaoGuard } from './autenticacao.guard.js';

describe('AutenticacaoGuard', () => {
  const verificarToken = vi.fn();
  const buscarUsuario = vi.fn();
  const jwtService = { verifyAsync: verificarToken } as unknown as JwtService;
  const repository = { buscarSessao: buscarUsuario } as unknown as AuthRepository;
  const guard = new AutenticacaoGuard(jwtService, repository);

  function contexto() {
    const requisicao = { headers: { authorization: 'Bearer token' } };
    const contexto = {
      switchToHttp: () => ({ getRequest: () => requisicao }),
    } as unknown as ExecutionContext;
    return { contexto, requisicao };
  }

  beforeEach(() => {
    verificarToken.mockReset();
    buscarUsuario.mockReset();
    verificarToken.mockResolvedValue({ sub: 2 });
  });

  it('aceita token de usuário ativo', async () => {
    buscarUsuario.mockResolvedValueOnce({ excluido_em: null });
    const { contexto: execucao, requisicao } = contexto();

    await expect(guard.canActivate(execucao)).resolves.toBe(true);
    expect(requisicao).toHaveProperty('usuarioId', 2);
  });

  it('rejeita token de usuário excluído', async () => {
    buscarUsuario.mockResolvedValueOnce({ excluido_em: new Date() });

    await expect(guard.canActivate(contexto().contexto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejeita token de usuário inexistente', async () => {
    buscarUsuario.mockResolvedValueOnce(null);

    await expect(guard.canActivate(contexto().contexto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
