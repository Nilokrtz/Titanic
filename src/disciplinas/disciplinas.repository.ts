import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto.js';
import { FindDisciplinasQueryDto } from './dto/find-disciplinas-query.dto.js';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto.js';

@Injectable()
export class DisciplinasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: CreateDisciplinaDto) {
    return this.prisma.disciplinas.create({ data: dados });
  }

  async listarComPaginacao(filtros: FindDisciplinasQueryDto) {
    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;
    const skip = (page - 1) * limit;
    const where: Prisma.disciplinasWhereInput = {};

    if (filtros.nome) {
      where.nome = { contains: filtros.nome, mode: 'insensitive' };
    }

    if (filtros.ativo !== undefined) {
      where.ativo = filtros.ativo;
    }

    const [dados, total] = await Promise.all([
      this.prisma.disciplinas.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nome: 'asc' },
      }),
      this.prisma.disciplinas.count({ where }),
    ]);

    return { dados, total };
  }

  async buscarPorId(id: number) {
    return this.prisma.disciplinas.findUnique({ where: { id } });
  }

  async buscarPorNome(nome: string) {
    return this.prisma.disciplinas.findUnique({ where: { nome } });
  }

  async atualizar(id: number, dados: UpdateDisciplinaDto) {
    return this.prisma.disciplinas.update({ where: { id }, data: dados });
  }

  async contarSalasVinculadas(id: number) {
    return this.prisma.salas_desafio.count({ where: { disciplina_id: id } });
  }

  async remover(id: number) {
    return this.prisma.disciplinas.delete({ where: { id } });
  }
}
