import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsuariosService } from './usuarios.service.js';

describe('UsuariosService', () => {
  const buscarUsuario = vi.fn();
  const prisma = {
    usuarios: { findUnique: buscarUsuario },
  } as unknown as PrismaService;
  const service = new UsuariosService(prisma);

  beforeEach(() => buscarUsuario.mockReset());

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
