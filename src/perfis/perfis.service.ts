import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePerfiDto } from './dto/create-perfi.dto.js';
import { ListarPerfisDto } from './dto/listar-perfis.dto.js';
import { ListarPerfisRespostaDto } from './dto/listar-perfis-resposta.dto.js';
import { PerfilRespostaDto } from './dto/perfil-resposta.dto.js';
import { UpdatePerfiDto } from './dto/update-perfi.dto.js';

@Injectable()
export class PerfisService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPerfiDto: CreatePerfiDto) {
    return 'This action adds a new perfi';
  }

  async findAll(filtros: ListarPerfisDto): Promise<ListarPerfisRespostaDto> {
    const condicoes: Prisma.perfisWhereInput = {};

    if (filtros.nome) {
      condicoes.nome = filtros.nome;
    }

    if (filtros.descricao) {
      condicoes.descricao = {
        contains: filtros.descricao,
        mode: 'insensitive',
      };
    }

    const total = await this.prisma.perfis.count({ where: condicoes });
    const perfis = await this.prisma.perfis.findMany({
      where: condicoes,
      select: { id: true, nome: true, descricao: true },
      orderBy: { id: 'asc' },
      skip: (filtros.page - 1) * filtros.limit,
      take: filtros.limit,
    });

    return {
      items: perfis,
      page: filtros.page,
      limit: filtros.limit,
      total,
    };
  }

  async findOne(id: number): Promise<PerfilRespostaDto> {
    const perfil = await this.prisma.perfis.findUnique({
      where: { id },
      select: { id: true, nome: true, descricao: true },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    return perfil;
  }

  async update(
    id: number,
    atualizacao: UpdatePerfiDto,
  ): Promise<PerfilRespostaDto> {
    const perfil = await this.prisma.perfis.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    return this.prisma.perfis.update({
      where: { id },
      data: { descricao: atualizacao.descricao },
      select: { id: true, nome: true, descricao: true },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} perfi`;
  }
}
