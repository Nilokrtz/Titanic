import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateQuizQuestoesDto } from './dto/create-quiz_questoes.dto.js';
import { FindQuizQuestoesQueryDto } from './dto/find-quiz-questoes-query.dto.js';
import { UpdateQuizQuestoesDto } from './dto/update-quiz_questoes.dto.js';

@Injectable()
export class QuizQuestoesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarSalaPorId(salaId: number) {
    return this.prisma.salas_desafio.findUnique({where: { id: salaId }});
  }

  async criar(data: CreateQuizQuestoesDto) {
    return this.prisma.quiz_questoes.create({
      data: { ...data, topico_atributo: data.topico_questao },
      include: { salas_desafio: true }
    });
  }

  async listarComFiltrosEPaginacao(filtros: FindQuizQuestoesQueryDto) {
    const where: Prisma.quiz_questoesWhereInput = {};

    if (filtros.sala_id !== undefined) {
      where.sala_id = filtros.sala_id;
    }
    
    if (filtros.topico_questao !== undefined) {
      where.topico_atributo = filtros.topico_questao;
    }

    if (filtros.enunciado) {
      where.enunciado = {
        contains: filtros.enunciado,
        mode: 'insensitive',
      };
    }

    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.quiz_questoes.findMany({
        where,
        include: {salas_desafio: true},
        orderBy: {id: 'asc'},
        skip,
        take: limit,
      }),
      this.prisma.quiz_questoes.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
    };
  }

  async buscarPorId(id: number) {
    return this.prisma.quiz_questoes.findUnique({
      where: { id },
      include: {salas_desafio: true},
    });
  }

  async atualizar(id: number, data: UpdateQuizQuestoesDto) {
    return this.prisma.quiz_questoes.update({
      where: { id },
      data,
      include: {salas_desafio: true},
    });
  }

  async remover(id: number) {
    return this.prisma.quiz_questoes.delete({
      where: { id }
    });
  }

  async buscarQuestaoPorId(questaoId: number) {
    return this.prisma.quiz_questoes.findUnique({
      where: { id: questaoId },
    });
  }
}