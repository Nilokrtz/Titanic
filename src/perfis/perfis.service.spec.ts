import { NotFoundException } from '@nestjs/common';
import { PerfisRepository } from './perfis.repository.js';
import { PerfisService } from './perfis.service.js';

describe('PerfisService', () => {
  const buscarPerfil = vi.fn();
  const atualizarPerfil = vi.fn();
  const repository = {
    buscarPorId: buscarPerfil,
    atualizarDescricao: atualizarPerfil,
  } as unknown as PerfisRepository;
  const service = new PerfisService(repository);

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
    expect(atualizarPerfil).toHaveBeenCalledWith(3, 'Perfil de aluno');
  });

  it('informa quando o perfil não existe', async () => {
    buscarPerfil.mockResolvedValueOnce(null);

    await expect(
      service.update(99, { descricao: 'Perfil de aluno' }),
    ).rejects.toThrow(NotFoundException);
    expect(atualizarPerfil).not.toHaveBeenCalled();
  });
});
