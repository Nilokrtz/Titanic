import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import type {Prisma} from '../generated/prisma/client.js';
import { CreateItenDto } from './dto/create-iten.dto.js';
import { FindItensQueryDto } from './dto/find-itens-query.dto.js';
import { UpdateItenDto } from './dto/update-iten.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';


@Injectable()
export class ItensService {
   private readonly cacheLoja = new Map<
   string, 
   { expiraEm: number ; dados: unknown}
  >();
private readonly TTL_MS =  60 * 1000; 

  constructor(private readonly prisma: PrismaService) {}


  async create(createItenDto: CreateItenDto) {
    const novoItem = await this.prisma.itens.create({
    return this.prisma.itens.create({
      data: createItenDto,
    });
    return novoItem;
  }

  
  async findAll(filtros?: FindItensQueryDto) {
   const chaveCache = JSON.stringify(filtros ?? {});
   const itemEmCache = this.cacheLoja.get(chaveCache);
   if (itemEmCache && itemEmCache.expiraEm > Date.now()) {
     return itemEmCache.dados;
   }

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

    const resultado = { items, page, limit, total };
    this.cacheLoja.set(chaveCache, {
      expiraEm: Date.now() + this.TTL_MS,
      dados: resultado,
    });
    return resultado;
  }

  async findOne(id: number) {

    const item = await this.prisma.itens.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Item nao encontrado.');
    }

    return item;
  }

  async update(id: number, updateItenDto: UpdateItenDto) {
    await this.findOne(id);

    const atualizazdo = await this.prisma.itens.update({
      where: { id },
      data: updateItenDto,
    });
    this.cacheLoja.clear();
    return atualizazdo;
 


  async remove(id: number) {
    const item = await this.findOne(id);

    if(item.tipo_efeito === 'EASTER_EGG') {
      throw new BadRequestException(
        'Nao e possível excluir um item lendario (Easter Egg) do catalogo.',
      );
    }

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
    this.cacheLoja.clear();
    return { mensagem: 'Item removido com sucesso.' };
  }
}

