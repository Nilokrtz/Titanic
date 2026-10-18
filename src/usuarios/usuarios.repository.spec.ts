import { PrismaService } from '../prisma/prisma.service.js';
import { UsuariosRepository } from './usuarios.repository.js';

describe('UsuariosRepository', () => {
  it('lista usuários ativos com filtros e paginação sem selecionar senha', async () => {
    const contar = vi.fn().mockResolvedValue(1);
    const buscar = vi.fn().mockResolvedValue([]);
    const prisma = {
      usuarios: { count: contar, findMany: buscar },
    } as unknown as PrismaService;
    const repository = new UsuariosRepository(prisma);

    await repository.listar({ page: 2, limit: 5, perfil_id: 3, email: 'aluno' });

    const condicoes = {
      excluido_em: null,
      perfil_id: 3,
      email: { contains: 'aluno', mode: 'insensitive' },
    };
    expect(contar).toHaveBeenCalledWith({ where: condicoes });
    expect(buscar).toHaveBeenCalledWith({
      where: condicoes,
      select: {
        id: true,
        email: true,
        perfis: { select: { nome: true } },
      },
      orderBy: { id: 'asc' },
      skip: 5,
      take: 5,
    });
  });

  it('exclui logicamente e invalida o refresh token', async () => {
    const atualizar = vi.fn().mockResolvedValue({ count: 1 });
    const prisma = {
      usuarios: { updateMany: atualizar },
    } as unknown as PrismaService;
    const repository = new UsuariosRepository(prisma);

    await repository.excluir(2);

    expect(atualizar).toHaveBeenCalledWith({
      where: { id: 2, excluido_em: null },
      data: {
        excluido_em: expect.any(Date),
        refresh_token_hash: null,
      },
    });
  });
});
