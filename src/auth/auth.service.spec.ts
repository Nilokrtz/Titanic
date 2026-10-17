import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';
import { SenhasService } from './senhas.service.js';

describe('AuthService', () => {
  const buscarUsuario = vi.fn();
  const atualizarUsuarios = vi.fn();
  const conferirSenha = vi.fn();
  const gerarHash = vi.fn();
  const verificarToken = vi.fn();
  const assinarToken = vi.fn();
  const prisma = {
    usuarios: {
      findUnique: buscarUsuario,
      updateMany: atualizarUsuarios,
    },
  } as unknown as PrismaService;
  const senhasService = {
    conferirSenha,
    gerarHash,
  } as unknown as SenhasService;
  const jwtService = {
    verifyAsync: verificarToken,
    signAsync: assinarToken,
  } as unknown as JwtService;
  const service = new AuthService(prisma, senhasService, jwtService);

  beforeEach(() => {
    buscarUsuario.mockReset();
    atualizarUsuarios.mockReset();
    conferirSenha.mockReset();
    gerarHash.mockReset();
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

  it('invalida o refresh token ao sair', async () => {
    atualizarUsuarios.mockResolvedValueOnce({ count: 1 });

    await expect(service.logout(2)).resolves.toBeUndefined();
    expect(atualizarUsuarios).toHaveBeenCalledWith({
      where: { id: 2, excluido_em: null },
      data: { refresh_token_hash: null },
    });
  });

  it('recusa logout quando o usuário não está mais ativo', async () => {
    atualizarUsuarios.mockResolvedValueOnce({ count: 0 });

    await expect(service.logout(2)).rejects.toThrow(UnauthorizedException);
  });

  it('altera a senha e invalida o refresh token', async () => {
    buscarUsuario.mockResolvedValueOnce({
      senha: 'hash-antigo',
      excluido_em: null,
    });
    conferirSenha.mockResolvedValueOnce(true);
    gerarHash.mockResolvedValueOnce('hash-novo');
    atualizarUsuarios.mockResolvedValueOnce({ count: 1 });

    await expect(
      service.alterarSenha(2, {
        senha_atual: 'senha-antiga',
        nova_senha: 'senha-nova',
      }),
    ).resolves.toBeUndefined();
    expect(conferirSenha).toHaveBeenCalledWith('senha-antiga', 'hash-antigo');
    expect(gerarHash).toHaveBeenCalledWith('senha-nova');
    expect(atualizarUsuarios).toHaveBeenCalledWith({
      where: { id: 2, senha: 'hash-antigo', excluido_em: null },
      data: { senha: 'hash-novo', refresh_token_hash: null },
    });
  });

  it('recusa senha atual incorreta', async () => {
    buscarUsuario.mockResolvedValueOnce({
      senha: 'hash-antigo',
      excluido_em: null,
    });
    conferirSenha.mockResolvedValueOnce(false);

    await expect(
      service.alterarSenha(2, {
        senha_atual: 'senha-errada',
        nova_senha: 'senha-nova',
      }),
    ).rejects.toThrow(UnauthorizedException);
    expect(atualizarUsuarios).not.toHaveBeenCalled();
  });

  it('recusa repetir a senha atual', async () => {
    buscarUsuario.mockResolvedValueOnce({
      senha: 'hash-antigo',
      excluido_em: null,
    });
    conferirSenha.mockResolvedValueOnce(true);

    await expect(
      service.alterarSenha(2, {
        senha_atual: 'mesma-senha',
        nova_senha: 'mesma-senha',
      }),
    ).rejects.toThrow(BadRequestException);
    expect(atualizarUsuarios).not.toHaveBeenCalled();
  });
});
