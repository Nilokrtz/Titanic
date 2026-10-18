import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRankDto } from './dto/create-rank.dto.js';
import { UpdateRankDto } from './dto/update-rank.dto.js';
import { FindRanksQueryDto } from './dto/find-ranks-query.dto.js';
import type { Prisma } from '../generated/prisma/client.js'

@Injectable()
export class RanksRepository {
  constructor(private readonly prisma: PrismaService) {}

   async criar(data: CreateRankDto) {
    return this.prisma.ranks.create({
      data,
    });
  }

  async listarComPaginacao(filtros: FindRanksQueryDto) {
    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ranksWhereInput = {};

    if (filtros.nome) {
      where.nome = { contains: filtros.nome, mode: 'insensitive' };
    }

    if (filtros.xp_minimo !== undefined) {
      where.xp_minimo = filtros.xp_minimo;
    }

    if (filtros.nivel_acesso !== undefined) {
      where.nivel_acesso = filtros.nivel_acesso;
    }

    const [data, total] = await Promise.all([
        this.prisma.ranks.findMany({
            where,
            skip,
            take: limit,
            orderBy: { nivel_acesso: 'asc' },
        }),
        this.prisma.ranks.count({ where }),
    ]);
    return { data, total};
  }

  async buscarPorId(id: number) {
    return this.prisma.ranks.findUnique({
      where: { id },
    });
  }

  async buscarPorNome(nome: string) {
    return this.prisma.ranks.findUnique({
      where: { nome },
    });
  }

  async buscarPorNivelAcesso(nivel_acesso: number) {
    return this.prisma.ranks.findFirst({
      where: { nivel_acesso },
    });
  }

  async buscarPorXpMinimo(xp_minimo: number) {
    return this.prisma.ranks.findFirst({
      where: { xp_minimo },
    });
  }

  async atualizar(id: number, data: UpdateRankDto) {
    return this.prisma.ranks.update({
      where: { id },
      data,
    });
  } 
  
  async remover(id: number) {
    return this.prisma.ranks.delete({
      where: { id },
    });
}
}

  

  

