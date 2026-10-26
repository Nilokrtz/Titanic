import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSalasDesafioDto } from './dto/create-salas_desafio.dto.js';
import { UpdateSalasDesafioDto } from './dto/update-salas_desafio.dto.js';
import { FindSalasQueryDto } from './dto/find-salas-query.dto.js';
import { Prisma } from '../generated/prisma/browser.js';

@Injectable()
export class SalasDesafioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorNumeroSala(numeroSala: number) {
    return this.prisma.salas_desafio.findUnique({
      where: { numero_sala: numeroSala },
    });
  }

  async buscarRankPorId(rankId: number) {
    return this.prisma.ranks.findUnique({
      where: { id: rankId },
    });
  }

  async buscarDisciplinaPorId(disciplinaId: number) {
    return this.prisma.disciplinas.findUnique({
      where: { id: disciplinaId },
    });
  }

  async criar(data: CreateSalasDesafioDto) {
    return this.prisma.salas_desafio.create({
      data,
      include: {ranks: true, disciplinas: true},
    });
  }

  async buscarSalaPorId(id: number){
    return this.prisma.salas_desafio.findUnique({
      where:{id},
      include:{ranks: true, disciplinas: true}
    });
  }

  async atualizarSala(id: number, data: UpdateSalasDesafioDto){
    return this.prisma.salas_desafio.update({
      where: {id},
      data,
      include:{ranks: true, disciplinas: true},
    });
  }
  async remover(id: number){
    return this.prisma.salas_desafio.delete({where:{id}});
  }

  async listarComFiltrosEPaginacao(filtros: FindSalasQueryDto) {
    const where: Prisma.salas_desafioWhereInput = {
      disciplina_id: 0
    };

    if (filtros.nome) {
      where.nome = {
        contains: filtros.nome,
        mode: 'insensitive',
      };
    }

    if (filtros.materia_foco) {
      where.materia_foco = {
        contains: filtros.materia_foco,
        mode: 'insensitive',
      };
    }

    if (filtros.rank_minimo_id !== undefined) {
      where.rank_minimo_id = filtros.rank_minimo_id;
    }

    if (filtros.disciplina_id !== undefined) {
      where.disciplina_id = filtros.disciplina_id;
    }

    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.salas_desafio.findMany({
        where,
        include: {ranks: true, disciplinas: true},
        orderBy: {numero_sala: 'asc'},
        skip,
        take: limit,
      }),
      this.prisma.salas_desafio.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
    };
  }
}