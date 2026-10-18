import { PrismaService } from '../prisma/prisma.service.js';
import { PerfisRepository } from './perfis.repository.js';

describe('PerfisRepository', () => {
  it('mantém filtros e paginação ao listar perfis', async () => {
    const contar = vi.fn().mockResolvedValue(1);
    const buscar = vi.fn().mockResolvedValue([
      { id: 3, nome: 'ALUNO', descricao: 'Perfil de aluno' },
    ]);
    const prisma = {
      perfis: { count: contar, findMany: buscar },
    } as unknown as PrismaService;
    const repository = new PerfisRepository(prisma);

    await expect(
      repository.listar({
        page: 2,
        limit: 5,
        nome: 'ALUNO',
        descricao: 'aluno',
      }),
    ).resolves.toEqual({
      items: [{ id: 3, nome: 'ALUNO', descricao: 'Perfil de aluno' }],
      page: 2,
      limit: 5,
      total: 1,
    });
    const condicoes = {
      nome: 'ALUNO',
      descricao: { contains: 'aluno', mode: 'insensitive' },
    };
    expect(contar).toHaveBeenCalledWith({ where: condicoes });
    expect(buscar).toHaveBeenCalledWith({
      where: condicoes,
      select: { id: true, nome: true, descricao: true },
      orderBy: { id: 'asc' },
      skip: 5,
      take: 5,
    });
  });
});
