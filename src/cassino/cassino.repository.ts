import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { FindCassinoQueryDto } from "./dto/find-cassino-query.dto.js";
import { UpdateCassinoDto } from "./dto/update-cassino.dto.js";
import { CreateCassinoDto } from "./dto/create-cassino.dto.js";
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class CassinoRepository{
    constructor(private readonly prisma: PrismaService){}

    async criar(dados: CreateCassinoDto){
        return this.prisma.cassino.create({
            data: dados
        });
    }

    async buscarPorNome(nome: string){
        return this.prisma.cassino.findFirst({
            where: { nome }
        });
    }

    async buscarPorId(id: number){
        return this.prisma.cassino.findUnique({
            where: { id }
        });
    }

    async listarComPaginacao(filtros: FindCassinoQueryDto){
        const page = filtros.page ?? 1;
        const limit = filtros.limit ?? 10
        const skip = (page - 1) * limit;

        const where: Prisma.cassinoWhereInput = {};

        if(filtros.nome){
            where.nome = { contains: filtros.nome, mode: 'insensitive'};
        }
        
        if(filtros.tipo_recompensa){
            where.tipo_recompensa = { contains: filtros.tipo_recompensa, mode: 'insensitive'};
        }

        const [dados, total] = await Promise.all([
            this.prisma.cassino.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'asc'}
            }),
            this.prisma.cassino.count({ where }),
        ]);

        return {dados, total};
    }

    async atualizar(id: number, dados: UpdateCassinoDto){
        return this.prisma.cassino.update({
            where: { id },
            data: dados
        });
    }

    async remover(id: number){
        return this.prisma.cassino.delete({
            where: { id }
        });
    }

    async buscarTodasOpcoes(){
        return this.prisma.cassino.findMany({
            orderBy: { id: 'asc' }
        });
    }

    async buscarPersonagemPorId(personagemId: number) {
    return this.prisma.personagens.findUnique({
      where: { id: personagemId },
    });
  }

  async atualizarMoedasPersonagem(personagemId: number, moedas: number) {
    return this.prisma.personagens.update({
      where: { id: personagemId },
      data: { moedas },
    });
  }

  async buscarTodosItens() {
    return this.prisma.itens.findMany();
  }

  async buscarInventarioPersonagem(personagemId: number) {
    return this.prisma.inventario_itens.findMany({
      where: { personagem_id: personagemId },
    });
  }

  async buscarItemNoInventario(personagemId: number, itemId: number) {
    return this.prisma.inventario_itens.findFirst({
      where: {
        personagem_id: personagemId,
        item_id: itemId,
      },
    });
  }

  async incrementarQuantidadeItem(inventarioId: number, quantidadeAtual: number) {
    return this.prisma.inventario_itens.update({
      where: { id: inventarioId },
      data: { quantidade: quantidadeAtual + 1 },
    });
  }

  async adicionarNovoItemInventario(personagemId: number, itemId: number) {
    return this.prisma.inventario_itens.create({
      data: {
        personagem_id: personagemId,
        item_id: itemId,
        quantidade: 1,
      },
    });
  }
}