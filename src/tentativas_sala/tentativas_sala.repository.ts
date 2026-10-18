import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTentativasSalaDto } from './dto/create-tentativas_sala.dto.js';
import { FindTentativasQueryDto } from './dto/find-tentativas-query.dto.js';
import { Prisma } from '../generated/prisma/browser.js';

@Injectable()
export class TentativasSalaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPersonagemPorId(personagemId: number) {
    return this.prisma.personagens.findUnique({
      where: { id: personagemId },
    });
  }

  async buscarSalaPorId(salaId: number) {
    return this.prisma.salas_desafio.findUnique({
      where: { id: salaId },
    });
  }

  async buscarQuestaoPorId(questaoId: number) {
    return this.prisma.quiz_questoes.findUnique({
      where: { id: questaoId },
    });
  }

  async criar(data: CreateTentativasSalaDto) {
    return this.prisma.tentativas_sala.create({
      data: {
        sala_id: data.sala_id,
        personagem_id: data.personagem_id,
        questao_atual_id: data.questao_atual_id,
        vida_restante: data.vida_restante,
        status: data.status ?? 'EM_ANDAMENTO',
        acertos: data.acertos ?? 0,
        erros: data.erros ?? 0,
        pulos_restantes: data.pulos_restantes ?? 1,
      },
      include: { personagens: true, salas_desafio: true, quiz_questoes: true }
    });
  }

  async listarComFiltrosEPaginacao(filtros: FindTentativasQueryDto) {
    const where: Prisma.tentativas_salaWhereInput = {};

    if (filtros.personagem_id !== undefined) {
      where.personagem_id = filtros.personagem_id;
    }

    if (filtros.sala_id !== undefined) {
      where.sala_id = filtros.sala_id;
    }

    if (filtros.status) {
      where.status = filtros.status;
    }

    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.tentativas_sala.findMany({
        where,
        include: { personagens: true, salas_desafio: true, quiz_questoes: true },
        orderBy: { iniciado_em: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.tentativas_sala.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
    };
  }

  async buscarPorId(id: number) {
    return this.prisma.tentativas_sala.findUnique({
      where: { id },
      include: { personagens: true, salas_desafio: { include: { ranks: true } }, quiz_questoes: true}
    });
  }

  async atualizar(id: number, data: CreateTentativasSalaDto) {
    return this.prisma.tentativas_sala.update({
      where: { id },
      data,
      include: {
        personagens: true,
        salas_desafio: true,
        quiz_questoes: true,
      },
    });
  }

  async remover(id: number) {
    return this.prisma.tentativas_sala.delete({
      where: { id },
    });
  }

  async buscarPersonagemCompleto(personagemId: number) {
    return this.prisma.personagens.findUnique({
      where: { id: personagemId },
      include: {
        ranks: true,
        especializacoes: true,
      },
    });
  }

  async buscarSalaComRankMinimo(salaId: number) {
    return this.prisma.salas_desafio.findUnique({
      where: { id: salaId },
      include: {
        ranks: true,
      },
    });
  }

  async buscarTentativaConcluida(personagemId: number, salaId: number) {
    return this.prisma.tentativas_sala.findFirst({
      where: {
        personagem_id: personagemId,
        sala_id: salaId,
        status: 'VITORIA',
      },
    });
  }

  async atualizarVidaEStatusPersonagem(personagemId: number, vidaAtual: number) {
    return this.prisma.personagens.update({
      where: { id: personagemId },
      data: { vida_atual: vidaAtual },
    });
  }

  async recompensarPersonagem(personagemId: number, xpGanha: number, moedasGanhas: number) {
    return this.prisma.personagens.update({
      where: { id: personagemId },
      data: {
        xp_atual: { increment: xpGanha },
        moedas: { increment: moedasGanhas },
      },
    });
  }

  async atualizarTentativa(
    tentativaId: number,
    data: {
      status?: 'EM_ANDAMENTO' | 'VITORIA' | 'DERROTA';
      vida_restante?: number;
      erros?: { increment: number } | number;
      acertos?: { increment: number } | number;
      questao_atual_id?: number;
    },
  ) {
    const isFinalizado = data.status && data.status !== 'EM_ANDAMENTO';

    return this.prisma.tentativas_sala.update({
      where: { id: tentativaId },
      data: {
        ...data,
        ...(isFinalizado ? { finalizado_em: new Date() } : {}),
      },
    });
  }

  async somarTotalErrosPersonagem(personagemId: number): Promise<number> {
    const resultado = await this.prisma.tentativas_sala.aggregate({
      where: { personagem_id: personagemId },
      _sum: { erros: true },
    });

    return resultado._sum.erros ?? 0;
  }

  async buscarVitoriaNoBossFinal(personagemId: number) {
    return this.prisma.tentativas_sala.findFirst({
      where: {
        personagem_id: personagemId,
        status: 'VITORIA',
        salas_desafio: {
          nome: {
            contains: 'Boss_Final',
            mode: 'insensitive',
          },
        },
      },
    });
  }
}