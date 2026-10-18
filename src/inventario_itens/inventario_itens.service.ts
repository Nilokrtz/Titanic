import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInventarioItenDto } from './dto/create-inventario_iten.dto.js';
import { FindInventarioQueryDto } from './dto/find-inventario-query.dto.js';
import { UpdateInventarioItenDto } from './dto/update-inventario_iten.dto.js';

@Injectable()
export class InventarioItensService {
  constructor(private readonly prisma: PrismaService) {}

  create(createInventarioItenDto: CreateInventarioItenDto) {
    return 'This action adds a new inventarioIten';
  }

  findAll() {
    return `This action returns all inventarioItens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventarioIten`;
  }

  update(id: number, updateInventarioItenDto: UpdateInventarioItenDto) {
    return `This action updates a #${id} inventarioIten`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventarioIten`;
  }

  async listarMochila(personagemId: number, filtros: FindInventarioQueryDto) {
    const condicoes: Prisma.inventario_itensWhereInput = {
      personagem_id: personagemId,
    };

    if (filtros.quantidade_minima !== undefined) {
      condicoes.quantidade = {
        gte: filtros.quantidade_minima,
      };
    }

    if (filtros.tipo_efeito) {
      condicoes.itens = {
        tipo_efeito: {
          contains: filtros.tipo_efeito,
          mode: 'insensitive',
        },
      };
    }

    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;

    const total = await this.prisma.inventario_itens.count({
      where: condicoes,
    });

    const items = await this.prisma.inventario_itens.findMany({
      where: condicoes,
      include: { itens: true },
      orderBy: { id: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, page, limit, total };
  }

  async descartarItem(personagemId: number, id: number) {
    const registro = await this.prisma.inventario_itens.findFirst({
      where: {
        id,
        personagem_id: personagemId,
      },
      include: { itens: true },
    });

    if (!registro || !registro.itens) {
      throw new NotFoundException(
        'Item não encontrado no inventário deste personagem.',
      );
    }

    const valorReembolso = Math.floor(registro.itens.preco_moedas * 0.9);

    return this.prisma.$transaction(async (tx) => {
      const personagemAtualizado = await tx.personagens.update({
        where: { id: personagemId },
        data: {
          moedas: { increment: valorReembolso },
        },
      });

      if ((registro.quantidade ?? 1) > 1) {
        const atualizado = await tx.inventario_itens.update({
          where: { id: registro.id },
          data: { quantidade: (registro.quantidade ?? 1) - 1 },
        });

        return {
          mensagem: 'Uma unidade do item foi vendida com 10% de taxa.',
          moedas_atuais: personagemAtualizado.moedas,
          inventario: atualizado,
        };
      }

      await tx.inventario_itens.delete({
        where: { id: registro.id },
      });

      return {
        mensagem: 'Item vendido completamente da mochila com 10% de taxa.',
        moedas_atuais: personagemAtualizado.moedas,
      };
    });
  }
}
