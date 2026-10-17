import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SenhasService } from '../auth/senhas.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsuariosService } from './usuarios.service.js';

describe('UsuariosService', () => {
  const buscarUsuario = vi.fn();
  const contarUsuarios = vi.fn();
  const listarUsuarios = vi.fn();
  const buscarPerfil = vi.fn();
  const criarUsuario = vi.fn();
  const gerarHash = vi.fn();
  const prisma = {
    perfis: { findUnique: buscarPerfil },
    usuarios: {
      findUnique: buscarUsuario,
      count: contarUsuarios,
      findMany: listarUsuarios,
      create: criarUsuario,
    },
  } as unknown as PrismaService;
  const senhasService = { gerarHash } as unknown as SenhasService;
  const service = new UsuariosService(prisma, senhasService);

  beforeEach(() => {
    buscarUsuario.mockReset();
    contarUsuarios.mockReset();
    listarUsuarios.mockReset();
    buscarPerfil.mockReset();
    criarUsuario.mockReset();
    gerarHash.mockReset();
  });

  it('cadastra usuário com senha em hash e retorna apenas dados públicos', async () => {
    buscarPerfil.mockResolvedValueOnce({ id: 3 });
    gerarHash.mockResolvedValueOnce('hash-da-senha');
    criarUsuario.mockResolvedValueOnce({
      id: 5,
      email: 'aluno@exemplo.com',
      perfis: { nome: 'ALUNO' },
    });

    await expect(
      service.create({
        email: ' Aluno@Exemplo.com ',
        senha: 'senha-segura',
        perfil_id: 3,
      }),
    ).resolves.toEqual({
      id: 5,
      email: 'aluno@exemplo.com',
      perfil: 'ALUNO',
    });
    expect(gerarHash).toHaveBeenCalledWith('senha-segura');
    expect(criarUsuario).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          email: 'aluno@exemplo.com',
          senha: 'hash-da-senha',
          perfis: { connect: { id: 3 } },
        },
      }),
    );
  });

  it('rejeita perfil inexistente', async () => {
    buscarPerfil.mockResolvedValueOnce(null);

    await expect(
      service.create({ email: 'aluno@exemplo.com', senha: 'senha', perfil_id: 99 }),
    ).rejects.toThrow(NotFoundException);
    expect(criarUsuario).not.toHaveBeenCalled();
  });

  it('informa conflito quando o email já existe', async () => {
    buscarPerfil.mockResolvedValueOnce({ id: 3 });
    gerarHash.mockResolvedValueOnce('hash-da-senha');
    criarUsuario.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('Email duplicado', {
        code: 'P2002',
        clientVersion: '7.10.0',
      }),
    );

    await expect(
      service.create({ email: 'aluno@exemplo.com', senha: 'senha', perfil_id: 3 }),
    ).rejects.toThrow(ConflictException);
  });

  it('lista usuários para o professor com filtros e paginação', async () => {
    buscarUsuario.mockResolvedValueOnce({
      perfis: { nome: 'ADMIN_PROFESSOR' },
    });
    contarUsuarios.mockResolvedValueOnce(6);
    listarUsuarios.mockResolvedValueOnce([
      {
        id: 2,
        email: 'aluno@exemplo.com',
        senha: 'hash',
        perfis: { nome: 'ALUNO' },
      },
    ]);

    await expect(
      service.findAll(
        { page: 2, limit: 5, perfil_id: 3, email: 'aluno' },
        1,
      ),
    ).resolves.toEqual({
      items: [{ id: 2, email: 'aluno@exemplo.com', perfil: 'ALUNO' }],
      page: 2,
      limit: 5,
      total: 6,
    });
    expect(contarUsuarios).toHaveBeenCalledWith({
      where: {
        perfil_id: 3,
        email: { contains: 'aluno', mode: 'insensitive' },
      },
    });
    expect(listarUsuarios).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 }),
    );
  });

  it('impede um aluno de listar usuários', async () => {
    buscarUsuario.mockResolvedValueOnce({ perfis: { nome: 'ALUNO' } });

    await expect(
      service.findAll({ page: 1, limit: 10 }, 2),
    ).rejects.toThrow(ForbiddenException);
    expect(contarUsuarios).not.toHaveBeenCalled();
  });

  it('rejeita a listagem quando o usuário da sessão não existe', async () => {
    buscarUsuario.mockResolvedValueOnce(null);

    await expect(
      service.findAll({ page: 1, limit: 10 }, 2),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('permite consultar o próprio usuário sem retornar senha', async () => {
    buscarUsuario
      .mockResolvedValueOnce({ id: 1, perfis: { nome: 'ALUNO' } })
      .mockResolvedValueOnce({
        id: 1,
        email: 'aluno@exemplo.com',
        perfis: { nome: 'ALUNO' },
      });

    await expect(service.findOne(1, 1)).resolves.toEqual({
      id: 1,
      email: 'aluno@exemplo.com',
      perfil: 'ALUNO',
    });
  });

  it('permite ao administrador consultar outro usuário', async () => {
    buscarUsuario
      .mockResolvedValueOnce({ id: 1, perfis: { nome: 'ADMIN_PROFESSOR' } })
      .mockResolvedValueOnce({
        id: 2,
        email: 'aluno@exemplo.com',
        perfis: { nome: 'ALUNO' },
      });

    await expect(service.findOne(2, 1)).resolves.toEqual({
      id: 2,
      email: 'aluno@exemplo.com',
      perfil: 'ALUNO',
    });
  });

  it('impede um aluno de consultar outro usuário', async () => {
    buscarUsuario.mockResolvedValueOnce({ id: 1, perfis: { nome: 'ALUNO' } });

    await expect(service.findOne(2, 1)).rejects.toThrow(ForbiddenException);
    expect(buscarUsuario).toHaveBeenCalledTimes(1);
  });

  it('rejeita uma sessão cujo usuário não existe', async () => {
    buscarUsuario.mockResolvedValueOnce(null);

    await expect(service.findOne(1, 1)).rejects.toThrow(UnauthorizedException);
  });

  it('informa quando o usuário procurado não existe', async () => {
    buscarUsuario
      .mockResolvedValueOnce({ id: 1, perfis: { nome: 'ADMIN_PROFESSOR' } })
      .mockResolvedValueOnce(null);

    await expect(service.findOne(2, 1)).rejects.toThrow(NotFoundException);
  });
});
