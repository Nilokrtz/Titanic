import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateEspecializacoeDto } from './dto/create-especializacoes.dto.js';
import { UpdateEspecializacoeDto } from './dto/update-especializacoes.dto.js';
import { FindEspecializacoesQueryDto } from './dto/find-especializacoes-query.dto.js'
import type { Prisma, tipo_especializacao } from '../generated/prisma/client.js'

@Injectable()
export class EspecializacoesRepository {
  constructor(private readonly prisma: PrismaService) {}

    async criar(dados: CreateEspecializacoeDto) {
        return this.prisma.especializacoes.create({ data: dados });
    }

    async listarComPaginacao(filtros: FindEspecializacoesQueryDto) {
        const page = filtros.page ?? 1;
        const limit = filtros.limit ?? 10;
        const skip = (page - 1) * limit;

        const where: Prisma.especializacoesWhereInput = {};

  if (filtros.nome) {
    where.nome = filtros.nome;
  }

  if (filtros.atributo_foco) {
    where.atributo_foco = filtros.atributo_foco;
  }

  if (filtros.descricao) {
    where.descricao = {
      contains: filtros.descricao,
      mode: 'insensitive',
    };
  }

  const [dados, total] = await Promise.all([
    this.prisma.especializacoes.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    }),
    this.prisma.especializacoes.count({ where }),
  ]);

  return { dados, total };
}

    async buscarPorId(id: number) {
        return this.prisma.especializacoes.findUnique({
            where: { id },
        });
    }

    async buscarPorNome(nome: tipo_especializacao) {
        return this.prisma.especializacoes.findUnique({
            where: { nome },
        });
    }

} 







