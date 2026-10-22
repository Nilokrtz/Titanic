import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { FindConquistasQueryDto } from './dto/find-conquistas-query.dto.js';

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
            this.prisma.itens.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'asc' },
            }),
            this.prisma.itens.count({ where }),
        ]);

        return { dados, total };
    }
}