   import { Injectable } from '@nestjs/common';
    import type { Prisma } from '../generated/prisma/client.js';
    import { PrismaService } from '../prisma/prisma.service.js';
    import { FindInventarioQueryDto } from './dto/find-inventario-query.dto.js';
    
    
    @Injectable()
    export class InventarioItensRepository {
       constructor(private readonly prisma: PrismaService) {}
    
    
      async buscarPersonagemPorId(personagemId: number) {
        return this.prisma.personagens.findUnique({
          where: { id: personagemId },
        });
      }
    
       async buscarUsuarioComPerfil(usuarioId: number) {
         return this.prisma.usuarios.findUnique({
           where: { id: usuarioId },
           select: {
             perfis: { select: { nome: true } },
           },
         });
       }
    
      async buscarItemPorId(itemId: number) {
        return this.prisma.itens.findUnique({
          where: { id: itemId },
        });
      }
    
      async buscarSalaPorId(salaId: number) {
        return this.prisma.salas_desafio.findUnique({
          where: { id: salaId },
        });
      }
    
    
      async buscarPorIdEPersonagem(id: number, personagemId: number) {
         return this.prisma.inventario_itens.findFirst({
          where: {
            id,
            personagem_id: personagemId,
          },
          include: { itens: true },
        });
      }
    
      async buscarPorItemEPersonagem(itemId: number, personagemId: number) {
        return this.prisma.inventario_itens.findFirst({
          where: {
            item_id: itemId,
            personagem_id: personagemId,
          },
          include: { itens: true },
        });
      }
    
      async listarItensDoPersonagem(personagemId: number) {
        return this.prisma.inventario_itens.findMany({
          where: { personagem_id: personagemId },
        });
      }
    
    
      async listarMochilaPaginada(personagemId: number, filtros: FindInventarioQueryDto) {
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
    
    
      async buscarTentativaAtivaDoPersonagem(personagemId: number, tentativaId?: number) {
        return this.prisma.tentativas_sala.findFirst({
          where: {
            personagem_id: personagemId,
            status: 'EM_ANDAMENTO',
            ...(tentativaId ? { id: tentativaId } : {}),
          },
          include: {
            salas_desafio: true,
          },
        });
      }
    
    
      async salvarCompraTransacao(
        personagemId: number,
        itemId: number,
        quantidade: number,
        custoTotal: number,
        registroExistenteId?: number,
        quantidadeExistente?: number,
      ) {
        return this.prisma.$transaction(async (tx) => {
          const personagemAtualizado = await tx.personagens.update({
            where: { id: personagemId },
            data: {
              moedas: { decrement: custoTotal },
            },
          });
    
          let itemInventario;
          if (registroExistenteId) {
            itemInventario = await tx.inventario_itens.update({
              where: { id: registroExistenteId },
              data: {
                quantidade: (quantidadeExistente ?? 1) + quantidade,
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
            moedas_atuais: personagemAtualizado.moedas,
            inventario: itemInventario,
          };
        });
      }
    
    
      async salvarVendaTransacao(
        personagemId: number,
        registroId: number,
        quantidadeRestante: number,
        valorTotalRecebido: number,
      ) {
         return this.prisma.$transaction(async (tx) => {
          const personagemAtualizado = await tx.personagens.update({
            where: { id: personagemId },
            data: {
              moedas: { increment: valorTotalRecebido },
            },
          });
    
          let inventarioRestante = null;
    
          if (quantidadeRestante > 0) {
            inventarioRestante = await tx.inventario_itens.update({
              where: { id: registroId },
              data: { quantidade: quantidadeRestante },
              include: { itens: true },
            });
          } else {
            await tx.inventario_itens.delete({
              where: { id: registroId },
            });
          }
    
          return {
            moedas_atuais: personagemAtualizado.moedas,
            inventario: inventarioRestante,
          };
        });
      }
    
    
      async consumirItemTransacao(
        personagemId: number,
        registroId: number,
        quantidadeRestante: number,
        novaVidaPersonagem?: number,
        tentativaId?: number,
        novaVidaTentativa?: number,
        novosPulosTentativa?: number,
      ) {
        return this.prisma.$transaction(async (tx) => {
          if (novaVidaPersonagem !== undefined) {
            await tx.personagens.update({
              where: { id: personagemId },
              data: { vida_atual: novaVidaPersonagem },
            });
          }
    
          if (tentativaId && novaVidaTentativa !== undefined) {
            await tx.tentativas_sala.update({
              where: { id: tentativaId },
              data: { vida_restante: novaVidaTentativa },
            });
          }
    
          if (tentativaId && novosPulosTentativa !== undefined) {
            await tx.tentativas_sala.update({
              where: { id: tentativaId },
              data: { pulos_restantes: novosPulosTentativa },
            });
          }
    
          if (quantidadeRestante > 0) {
            return tx.inventario_itens.update({
              where: { id: registroId },
              data: { quantidade: quantidadeRestante },
              include: { itens: true },
            });
          }
    
          await tx.inventario_itens.delete({
            where: { id: registroId },
          });
          return null;
        });
      }
    }