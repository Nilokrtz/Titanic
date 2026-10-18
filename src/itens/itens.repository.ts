import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateItenDto } from './dto/create-iten.dto.js';
import { FindItensQueryDto } from './dto/find-itens-query.dto.js';
import { UpdateItenDto } from './dto/update-iten.dto.js';

@Injectable()
export class ItensRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: CreateItenDto) {
    return this.prisma.itens.create({
      data: dados,
    });
  }

  async buscarPorId(id: number) {
    return this.prisma.itens.findUnique({
      where: { id },
    });
  }

  async listarComPaginacao(filtros?: FindItensQueryDto) {
    const condicoes: Prisma.itensWhereInput = {};

    if (filtros?.tipo_efeito) {
      condicoes.tipo_efeito = {
        contains: filtros.tipo_efeito,
        mode: 'insensitive',
      };
    }

    if (filtros?.preco_maximo !== undefined) {
      condicoes.preco_moedas = {
        lte: filtros.preco_maximo,
      };
    }

    const page = filtros?.page ?? 1;
    const limit = filtros?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.itens.findMany({
        where: condicoes,
        orderBy: { id: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.itens.count({ where: condicoes }),
    ]);

    return {
      items,
      page,
      limit,
      total,
    };
  }

  async atualizar(id: number, dados: UpdateItenDto) {
    return this.prisma.itens.update({
      where: { id },
      data: dados,
    });
  }

  async remover(id: number) {
    return this.prisma.itens.delete({
      where: { id },
    });
  }

  async contarEmInventarios(itemId: number) {
    return this.prisma.inventario_itens.count({
      where: { item_id: itemId },
    });
  }
}

