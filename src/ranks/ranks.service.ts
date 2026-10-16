import { Injectable } from '@nestjs/common';
import { CreateRankDto } from './dto/create-rank.dto.js';
import { UpdateRankDto } from './dto/update-rank.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { FindRanksQueryDto } from './dto/find-ranks-query.dto.js';

@Injectable()
export class RanksService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRankDto: CreateRankDto) {
    return 'This action adds a new rank';
  }

  async findAll(query: FindRanksQueryDto) {
    const { page = 1, limit = 10, nome, nivel_acesso } = query;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (nome) {
      where.nome = { contains: nome, mode: 'insensitive' };
    }
    if (nivel_acesso) {
      where.nivel_acesso = nivel_acesso;
    }

    const [data, total] = await Promise.all([
      this.prisma.ranks.findMany({
        where,
        skip,
        take: limit,
        orderBy: {nivel_acesso: 'asc'},
      }),
      this.prisma.ranks.count({ where }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
        limit,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} rank`;
  }

  update(id: number, updateRankDto: UpdateRankDto) {
    return `This action updates a #${id} rank`;
  }

  remove(id: number) {
    return `This action removes a #${id} rank`;
  }
}
