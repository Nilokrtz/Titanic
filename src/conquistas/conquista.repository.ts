import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { FindConquistasQueryDto } from './dto/find-conquistas-query.dto.js';
import { UpdateConquistaDto } from './dto/update-conquista.dto.js';
import { CreateConquistaDto } from './dto/create-conquista.dto.js';

@Injectable()
export class ConquistasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listarComPaginacao(filtros: FindConquistasQueryDto) {
        const page = filtros.page ?? 1;
        const limit = filtros.limit ?? 10;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }

        const [dados, total] = await Promise.all([
            this.prisma.conquistas.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'asc' },
            }),
            this.prisma.conquistas.count({ where }),
        ]);

        return { dados, total };
    }


async criar (dados: CreateConquistaDto) {
    return this.prisma.conquistas.create({
        data: dados
    });
}

async buscarPorNome(nome: string) {
    return this.prisma.conquistas.findUnique({
        where: { nome },
    });
}
async buscarPorId(id: number) {
    return this.prisma.conquistas.findUnique({
        where: { id },
    });
 }

async atualizar(id: number, dados: UpdateConquistaDto) {
    return this.prisma.conquistas.update({
        where: { id },
        data: dados
    });
}

 
async remover(id: number) {
    return this.prisma.conquistas.delete({
        where: { id },
    });
}

async buscarProgressoPersonagem(personagemId: number) {
    const [personagem, tentativas, todasConquistas] = await Promise.all([
          this.prisma.personagens.findUnique({
            where: { id: personagemId },
          }),
          this.prisma.tentativas_sala.findMany({
            where: { personagem_id: personagemId },
            include: { salas_desafio: true },
          }),
          this.prisma.conquistas.findMany({
            orderBy: { id: 'asc' },
          }),
        ]);
        return { personagem, tentativas, todasConquistas };
    }
}