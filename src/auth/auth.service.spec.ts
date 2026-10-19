import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { SenhasService } from './senhas.service.js';
import { EmailService } from './email.service.js';

describe('AuthService', () => {
  const buscarPerfilAluno = vi.fn();
  const criarAluno = vi.fn();
  const buscarUsuario = vi.fn();
  const atualizarUsuarios = vi.fn();
  const salvarRefreshToken = vi.fn();
  const conferirSenha = vi.fn();
  const gerarHash = vi.fn();
  const verificarToken = vi.fn();
  const assinarToken = vi.fn();
  const enviarBoasVindas = vi.fn();
  const repository = {
    buscarPerfilAluno,
    criarAluno,
    buscarCredenciais: buscarUsuario,
    buscarSenha: buscarUsuario,
    salvarRefreshToken,
    renovarRefreshToken: atualizarUsuarios,
    limparRefreshToken: atualizarUsuarios,
    alterarSenha: atualizarUsuarios,
  } as unknown as AuthRepository;
  const senhasService = {
    conferirSenha,
    gerarHash,
  } as unknown as SenhasService;
  const jwtService = {
    verifyAsync: verificarToken,
    signAsync: assinarToken,
  } as unknown as JwtService;
  const emailService = { enviarBoasVindas } as unknown as EmailService;
  const service = new AuthService(repository, senhasService, jwtService, emailService);

  beforeEach(() => {
    buscarPerfilAluno.mockReset();
    criarAluno.mockReset();
    buscarUsuario.mockReset();
    atualizarUsuarios.mockReset();
    salvarRefreshToken.mockReset();
    conferirSenha.mockReset();
    gerarHash.mockReset();
    verificarToken.mockReset();
    assinarToken.mockReset();
    enviarBoasVindas.mockReset();
  });

  it('registra aluno com senha em hash e sem devolvê-la', async () => {
    buscarPerfilAluno.mockResolvedValueOnce({ id: 3 });
    gerarHash.mockResolvedValueOnce('hash-da-senha');
    criarAluno.mockResolvedValueOnce({ id: 2, email: 'aluno@exemplo.com' });

    await expect(
      service.registrar({ email: ' Aluno@Exemplo.com ', senha: 'senha-segura' }),
    ).resolves.toEqual({ id: 2, email: 'aluno@exemplo.com', perfil: 'ALUNO' });
    expect(criarAluno).toHaveBeenCalledWith(
      'aluno@exemplo.com',
      'hash-da-senha',
      3,
    );
    expect(enviarBoasVindas).toHaveBeenCalledWith('aluno@exemplo.com');
  });

  it('faz login e guarda o hash do refresh token', async () => {
    const segredoAnterior = process.env.JWT_REFRESH_SECRET;
    process.env.JWT_REFRESH_SECRET = 'segredo-de-teste';
    buscarUsuario.mockResolvedValueOnce({
      id: 2,
      senha: 'hash-da-senha',
      excluido_em: null,
    });
    conferirSenha.mockResolvedValueOnce(true);
    assinarToken
      .mockResolvedValueOnce('token-de-acesso')
      .mockResolvedValueOnce('token-de-refresh');

    try {
      await expect(
        service.login({ email: ' Aluno@Exemplo.com ', senha: 'senha-segura' }),
      ).resolves.toMatchObject({
        access_token: 'token-de-acesso',
        refresh_token: 'token-de-refresh',
      });
      expect(buscarUsuario).toHaveBeenCalledWith('aluno@exemplo.com');
      expect(salvarRefreshToken).toHaveBeenCalledWith(
        2,
        expect.stringMatching(/^[a-f0-9]{64}$/),
      );
    } finally {
      if (segredoAnterior === undefined) {
        delete process.env.JWT_REFRESH_SECRET;
      } else {
        process.env.JWT_REFRESH_SECRET = segredoAnterior;
      }
    }
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
        2,
        expect.any(String),
        expect.any(String),
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
    expect(atualizarUsuarios).toHaveBeenCalledWith(2);
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
    expect(atualizarUsuarios).toHaveBeenCalledWith(2, 'hash-antigo', 'hash-novo');
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
