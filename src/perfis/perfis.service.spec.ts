import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PerfisService } from './perfis.service.js';

describe('PerfisService', () => {
  const buscarPerfil = vi.fn();
  const atualizarPerfil = vi.fn();
  const prisma = {
    perfis: {
      findUnique: buscarPerfil,
      update: atualizarPerfil,
    },
  } as unknown as PrismaService;
  const service = new PerfisService(prisma);

  beforeEach(() => {
    buscarPerfil.mockReset();
    atualizarPerfil.mockReset();
  });

  it('atualiza somente a descrição do perfil', async () => {
    buscarPerfil.mockResolvedValueOnce({ id: 3 });
    atualizarPerfil.mockResolvedValueOnce({
      id: 3,
      nome: 'ALUNO',
      descricao: 'Perfil de aluno',
    });

    await expect(
      service.update(3, { descricao: 'Perfil de aluno' }),
    ).resolves.toEqual({
      id: 3,
      nome: 'ALUNO',
      descricao: 'Perfil de aluno',
    });
    expect(atualizarPerfil).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { descricao: 'Perfil de aluno' },
      select: { id: true, nome: true, descricao: true },
    });
  });

  it('informa quando o perfil não existe', async () => {
    buscarPerfil.mockResolvedValueOnce(null);

    await expect(
      service.update(99, { descricao: 'Perfil de aluno' }),
    ).rejects.toThrow(NotFoundException);
    expect(atualizarPerfil).not.toHaveBeenCalled();
  });
});
