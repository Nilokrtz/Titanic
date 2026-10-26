import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTentativasDto } from './dto/create-tentativas_sala.dto.js';
import { FindTentativasQueryDto } from './dto/find-tentativas-query.dto.js';
import { Prisma } from '../generated/prisma/browser.js';
import { UpdateTentativasDto } from './dto/update-tentativas_sala.dto.js';

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

  async criar(data: CreateTentativasDto) {
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

    if (!filtros.personagem_id) {
      where.personagem_id = filtros.personagem_id;
    }

    if (!filtros.sala_id) {
      where.sala_id = filtros.sala_id;
    }

    if (!filtros.status) {
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

  async atualizar(id: number, data: UpdateTentativasDto) {
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
  
  async buscarEspecializacaoPorId(especializacaoId: number) {
    return this.prisma.especializacoes.findUnique({
      where: { id: especializacaoId },
    });
  }

  async deletarInventarioDoPersonagemId(personagemId: number) {
    return this.prisma.inventario_itens.deleteMany({
      where: { personagem_id: personagemId },
    });
  }

  async verificarSeJaFezAFase(personagemId: number, salaId: number){
    return await this.prisma.tentativas_sala.findFirst({
      where: {
        personagem_id: personagemId,
        sala_id: salaId,
        status: 'VITORIA',
      },
    });
  }

  async atualizarPersonagem(personagemId: number, xpAtual: number, moedas: number, rankId: number,) {
    return this.prisma.personagens.update({
      where: { id: personagemId },
      data: {
        xp_atual: xpAtual,
        moedas: moedas,
        rank_id: rankId,
      },
    });
  }
}