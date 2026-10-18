import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ListarPerfisDto } from './dto/listar-perfis.dto.js';
import { ListarPerfisRespostaDto } from './dto/listar-perfis-resposta.dto.js';

@Injectable()
export class PerfisRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(filtros: ListarPerfisDto): Promise<ListarPerfisRespostaDto> {
    const condicoes: Prisma.perfisWhereInput = {};

    if (filtros.nome) {
      condicoes.nome = filtros.nome;
    }

    if (filtros.descricao) {
      condicoes.descricao = {
        contains: filtros.descricao,
        mode: 'insensitive',
      };
    }

    const total = await this.prisma.perfis.count({ where: condicoes });
    const perfis = await this.prisma.perfis.findMany({
      where: condicoes,
      select: { id: true, nome: true, descricao: true },
      orderBy: { id: 'asc' },
      skip: (filtros.page - 1) * filtros.limit,
      take: filtros.limit,
    });

    return {
      items: perfis,
      page: filtros.page,
      limit: filtros.limit,
      total,
    };
  }

  buscarPorId(id: number) {
    return this.prisma.perfis.findUnique({
      where: { id },
      select: { id: true, nome: true, descricao: true },
    });
  }

  atualizarDescricao(id: number, descricao: string) {
    return this.prisma.perfis.update({
      where: { id },
      data: { descricao },
      select: { id: true, nome: true, descricao: true },
    });
  }

  async listarPermissoesDoPerfil(perfilId: number) {
    return this.prisma.perfis.findUnique({
      where: { id: perfilId },
      select: {
        id: true,
        nome: true,
        perfis_permissoes: {
          select: {
            permissoes: true, 
          },
        },
      },
    });
  }

  async adicionarPermissao(perfilId: number, permissaoId: number) {
  return this.prisma.perfis_permissoes.create({
    data: {
      perfil_id: perfilId,       
      permissao_id: permissaoId, 
    },
  });
}
  
}
