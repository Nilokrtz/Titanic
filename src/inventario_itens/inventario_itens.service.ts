import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma, tipo_perfil } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInventarioItenDto } from './dto/create-inventario_iten.dto.js';
import { FindInventarioQueryDto } from './dto/find-inventario-query.dto.js';
import { UpdateInventarioItenDto } from './dto/update-inventario_iten.dto.js';
import { ComprarItemDto } from './dto/comprar-item.dto.js';

@Injectable()
export class InventarioItensService {
  constructor(private readonly prisma: PrismaService) {}

  async comprarItem(
    personagemId: number,
    comprarItemDto: ComprarItemDto,
    usuarioId?: number,
  ) {
    const itemId = comprarItemDto.item_id ?? comprarItemDto.itemId;
    if (!itemId) {
      throw new BadRequestException('O ID do item (item_id) é obrigatório.');
    }

    const quantidade = comprarItemDto.quantidade ?? 1;
    if (quantidade <= 0) {
      throw new BadRequestException(
        'A quantidade a comprar deve ser maior que zero.',
      );
    }

    if (quantidade > 2) {
      throw new BadRequestException(
        'O personagem só pode carregar no máximo 2 itens no inventário.',
      );
    }

    // 1. Busca e valida o personagem
    const personagem = await this.prisma.personagens.findUnique({
      where: { id: personagemId },
    });

    if (!personagem) {
      throw new NotFoundException('Personagem não encontrado.');
    }

    // 2. Valida se o usuário tem permissão para comprar para este personagem
    if (usuarioId !== undefined) {
      const usuario = await this.prisma.usuarios.findUnique({
        where: { id: usuarioId },
        select: {
          perfis: { select: { nome: true } },
        },
      });

      const isOwner = personagem.usuario_id === usuarioId;
      const isAdmin = usuario?.perfis?.nome === tipo_perfil.ADMIN_PROFESSOR;

      if (!isOwner && !isAdmin) {
        throw new ForbiddenException(
          'Apenas o dono do personagem pode realizar compras.',
        );
      }
    }

    // 3. Busca e valida o item no catálogo da loja
    const item = await this.prisma.itens.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado na loja.');
    }

    if (item.tipo_efeito === 'EASTER_EGG') {
      throw new BadRequestException(
        'Itens lendários do tipo Easter Egg não estão disponíveis para compra.',
      );
    }

    const custoTotal = item.preco_moedas * quantidade;

    // 4. Executa a transação atômica
    return this.prisma.$transaction(async (tx) => {
      // Re-valida o saldo do personagem
      const personagemTx = await tx.personagens.findUnique({
        where: { id: personagemId },
      });

      if (!personagemTx) {
        throw new NotFoundException('Personagem não encontrado.');
      }

      const saldoAtual = personagemTx.moedas ?? 0;
      if (saldoAtual < custoTotal) {
        throw new BadRequestException(
          `Saldo insuficiente. O item custa ${custoTotal} moeda(s), mas o personagem possui apenas ${saldoAtual} moeda(s). O saldo não pode ficar negativo.`,
        );
      }

      // Re-valida a restrição de inventário na mão (Máximo de 2 itens)
      const inventarioAtual = await tx.inventario_itens.findMany({
        where: { personagem_id: personagemId },
      });

      const totalItensAtuais = inventarioAtual.reduce(
        (acc, curr) => acc + (curr.quantidade ?? 1),
        0,
      );

      if (totalItensAtuais + quantidade > 2) {
        throw new BadRequestException(
          `O personagem só pode carregar no máximo 2 itens no inventário. O inventário atual já possui ${totalItensAtuais} item(ns).`,
        );
      }

      // Deduz as moedas do personagem (saldo não-negativo garantido)
      const personagemAtualizado = await tx.personagens.update({
        where: { id: personagemId },
        data: {
          moedas: { decrement: custoTotal },
        },
      });

      // Verifica se o item já existe no inventário para empilhar (stack)
      const itemExistente = inventarioAtual.find(
        (inv) => inv.item_id === itemId,
      );

      let itemInventario;
      if (itemExistente) {
        itemInventario = await tx.inventario_itens.update({
          where: { id: itemExistente.id },
          data: {
            quantidade: (itemExistente.quantidade ?? 1) + quantidade,
          },
          include: { itens: true },
        });
      } else {
        itemInventario = await tx.inventario_itens.create({
          data: {
            personagem_id: personagemId,
            item_id: itemId,
            quantidade,
          },
          include: { itens: true },
        });
      }

      return {
        mensagem: 'Item comprado com sucesso.',
        item: {
          id: item.id,
          nome: item.nome,
          preco_unitario: item.preco_moedas,
          quantidade_comprada: quantidade,
          custo_total: custoTotal,
        },
        moedas_atuais: personagemAtualizado.moedas,
        total_itens_inventario: totalItensAtuais + quantidade,
        inventario: itemInventario,
      };
    });
  }

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
