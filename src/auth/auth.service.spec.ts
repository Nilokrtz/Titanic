import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';
import { SenhasService } from './senhas.service.js';

describe('AuthService com usuário excluído', () => {
  const buscarUsuario = vi.fn();
  const atualizarUsuarios = vi.fn();
  const conferirSenha = vi.fn();
  const verificarToken = vi.fn();
  const assinarToken = vi.fn();
  const prisma = {
    usuarios: {
      findUnique: buscarUsuario,
      updateMany: atualizarUsuarios,
    },
  } as unknown as PrismaService;
  const senhasService = { conferirSenha } as unknown as SenhasService;
  const jwtService = {
    verifyAsync: verificarToken,
    signAsync: assinarToken,
  } as unknown as JwtService;
  const service = new AuthService(prisma, senhasService, jwtService);

  beforeEach(() => {
    buscarUsuario.mockReset();
    atualizarUsuarios.mockReset();
    conferirSenha.mockReset();
    verificarToken.mockReset();
    assinarToken.mockReset();
  });

  it('não permite login de usuário excluído', async () => {
    buscarUsuario.mockResolvedValueOnce({
      id: 2,
      senha: 'hash',
      excluido_em: new Date(),
    });

    await expect(
      service.login({ email: 'aluno@exemplo.com', senha: 'senha' }),
    ).rejects.toThrow(UnauthorizedException);
    expect(conferirSenha).not.toHaveBeenCalled();
  });

  it('não renova token de usuário excluído', async () => {
    const segredoAnterior = process.env.JWT_REFRESH_SECRET;
    process.env.JWT_REFRESH_SECRET = 'segredo-de-teste';
    verificarToken.mockResolvedValueOnce({ sub: 2, tipo: 'refresh' });
    assinarToken
      .mockResolvedValueOnce('novo-acesso')
      .mockResolvedValueOnce('novo-refresh');
    atualizarUsuarios.mockResolvedValueOnce({ count: 0 });

    try {
      await expect(
        service.refresh({ refresh_token: 'refresh-antigo' }),
      ).rejects.toThrow(UnauthorizedException);
      expect(atualizarUsuarios).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ excluido_em: null }),
        }),
      );
    } finally {
      if (segredoAnterior === undefined) {
        delete process.env.JWT_REFRESH_SECRET;
      } else {
        process.env.JWT_REFRESH_SECRET = segredoAnterior;
      }
    }
  });
});
