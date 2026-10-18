import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePersonagenDto } from './dto/create-personagen.dto.js';
import { ListarPersonagensDto } from './dto/listar-personagens.dto.js';

@Injectable()
export class PersonagensRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarUsuarioPorId(usuarioId: number) {
    return this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
    });
  }

  async buscarPerfilDoUsuario(usuarioId: number) {
    return this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: {
        excluido_em: true,
        perfis: { select: { nome: true } },
      },
    });
  }

  async buscarEspecializacaoPorId(especializacaoId: number) {
    return this.prisma.especializacoes.findUnique({
      where: { id: especializacaoId },
    });
  }

  async buscarRankInicial() {
    return this.prisma.ranks.findUnique({
      where: { nome: 'Estagiário' },
    });
  }

  async buscarPersonagemPorUsuarioId(usuarioId: number) {
    return this.prisma.personagens.findUnique({
      where: { usuario_id: usuarioId },
    });
  }

  async buscarPersonagemPorNome(nome: string) {
    return this.prisma.personagens.findUnique({
      where: { nome },
    });
  }

  async buscarPersonagemPorId(id: number) {
    return this.prisma.personagens.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        usuario_id: true,
        especializacao_id: true,
        rank_id: true,
        xp_atual: true,
        vida_maxima: true,
        vida_atual: true,
        moedas: true,
      },
    });
  }

  async criar(personagem: CreatePersonagenDto, usuarioId: number, rankId: number) {
    return this.prisma.personagens.create({
      data: {
        nome: personagem.nome,
        especializacao_id: personagem.especializacao_id,
        usuario_id: usuarioId,
        rank_id: rankId,
        moedas: 0,
      },
      include: {
        especializacoes: true,
        ranks: true,
      },
    });
  }

  async listar(filtros: ListarPersonagensDto) {
    const condicoes: Prisma.personagensWhereInput = {};

    if (filtros.nome) {
      condicoes.nome = { contains: filtros.nome, mode: 'insensitive' };
    }

    if (filtros.especializacao_id) {
      condicoes.especializacao_id = filtros.especializacao_id;
    }

    const total = await this.prisma.personagens.count({ where: condicoes });
    const personagens = await this.prisma.personagens.findMany({
      where: condicoes,
      select: {
        id: true,
        nome: true,
        usuario_id: true,
        especializacao_id: true,
        rank_id: true,
        xp_atual: true,
        vida_maxima: true,
        vida_atual: true,
        moedas: true,
      },
      orderBy: { id: 'asc' },
      skip: (filtros.page - 1) * filtros.limit,
      take: filtros.limit,
    });

    return {
      items: personagens,
      page: filtros.page,
      limit: filtros.limit,
      total,
    };
  }

  async excluir(id: number) {
    return this.prisma.personagens.deleteMany({ where: { id } });
  }
}
