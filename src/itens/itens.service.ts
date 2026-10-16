import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import type {Prisma} from '../generated/prisma/client.js';
import { CreateItenDto } from './dto/create-iten.dto.js';
import { FindItensQueryDto } from './dto/find-itens-query.dto.js';
import { UpdateItenDto } from './dto/update-iten.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';


@Injectable()
export class ItensService {
   constructor(private readonly prisma: PrismaService) {}

  

  create(createItenDto: CreateItenDto) {
    return this.prisma.itens.create({
      data: createItenDto,
    });
  }

  
  async findAll(filtros?: FindItensQueryDto) {
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

    const total = await this.prisma.itens.count({ where: condicoes });
    const items = await this.prisma.itens.findMany({
      where: condicoes,
      orderBy: { id: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, page, limit, total};
  }

  async findOne(id: number) {

    const item = await this.prisma.itens.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado.');
    }

    return item;
  }

  async update(id: number, updateItenDto: UpdateItenDto) {
    await this.findOne(id);

    return this.prisma.itens.update({
      where: { id },
      data: updateItenDto,
    });
  }


  async remove(id: number) {
    await this.findOne(id);
    const quantidadeEmMochilas = await this.prisma.inventario_itens.count({
      where: { item_id: id },
    });
    if (quantidadeEmMochilas > 0) {
      throw new BadRequestException(
        'Nao e possível excluir um item que ja esta no inventario de personagens.',
      );
    }

    await this.prisma.itens.delete({
      where: { id },
    });
    return { mensagem: 'Item removido com sucesso.' };
  }
}

