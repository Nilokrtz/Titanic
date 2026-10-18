import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateItenDto } from './dto/create-iten.dto.js';
import { FindItensQueryDto } from './dto/find-itens-query.dto.js';
import { UpdateItenDto } from './dto/update-iten.dto.js';
import { ItensRepository } from './itens.repository.js';

@Injectable()
export class ItensService {
  private readonly cacheLoja = new Map<
    string,
    { expiraEm: number; dados: unknown }
  >();
  private readonly TTL_MS = 60 * 1000;

  constructor(private readonly repository: ItensRepository) {}

  async create(createItenDto: CreateItenDto) {
    const novoItem = await this.repository.criar(createItenDto);
    this.cacheLoja.clear();
    return novoItem;
  }

  async findAll(filtros?: FindItensQueryDto) {
    const chaveCache = JSON.stringify(filtros ?? {});
    const itemEmCache = this.cacheLoja.get(chaveCache);
    if (itemEmCache && itemEmCache.expiraEm > Date.now()) {
      return itemEmCache.dados;
    }

    const resultado = await this.repository.listarComPaginacao(filtros);
    this.cacheLoja.set(chaveCache, {
      expiraEm: Date.now() + this.TTL_MS,
      dados: resultado,
    });
    return resultado;
  }

  async findOne(id: number) {
    const item = await this.repository.buscarPorId(id);

    if (!item) {
      throw new NotFoundException('Item nao encontrado.');
    }

    return item;
  }

  async update(id: number, updateItenDto: UpdateItenDto) {
    await this.findOne(id);

    const atualizado = await this.repository.atualizar(id, updateItenDto);
    this.cacheLoja.clear();
    return atualizado;
  }

  async remove(id: number) {
    const item = await this.findOne(id);

    if (item.tipo_efeito === 'EASTER_EGG') {
      throw new BadRequestException(
        'Nao e possível excluir um item lendario (Easter Egg) do catalogo.',
      );
    }

    const quantidadeEmMochilas = await this.repository.contarEmInventarios(id);
    if (quantidadeEmMochilas > 0) {
      throw new BadRequestException(
        'Nao e possível excluir um item que ja esta no inventario de personagens.',
      );
    }

    await this.repository.remover(id);
    this.cacheLoja.clear();
    return { mensagem: 'Item removido com sucesso.' };
  }
}


