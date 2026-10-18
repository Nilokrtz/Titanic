import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePermissoeDto } from './dto/create-permissoe.dto.js';
import { FindPermissoesQueryDto } from './dto/find-permissoes-query.dto.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class PermissoesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async criar(dados: CreatePermissoeDto) {
        return this.prisma.permissoes.create({
            data: dados,
        });
    }

    async buscarPorSlug(slug: string) {
        return this.prisma.permissoes.findUnique({
            where: { slug },
        });
    }

    async listarComPaginacao(filtros: FindPermissoesQueryDto) {
        const page = filtros.page ?? 1;
        const limit = filtros.limit ?? 10;
        const skip = (page - 1) * limit;

        const where: Prisma.permissoesWhereInput = {};

        if (filtros.slug) {
            where.slug = { contains: filtros.slug, mode: 'insensitive' };
        }
        if (filtros.descricao) {
            where.descricao = { contains: filtros.descricao, mode: 'insensitive' };
        }

        const [dados, total] = await Promise.all([
            this.prisma.permissoes.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'asc' },
            }),
            this.prisma.permissoes.count({ where }),
        ]);

        return { dados, total };
    }

}