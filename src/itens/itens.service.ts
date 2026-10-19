import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateItenDto } from './dto/create-iten.dto.js';
import { FindItensQueryDto } from './dto/find-itens-query.dto.js';
import { UpdateItenDto } from './dto/update-iten.dto.js';
import { ItensRepository } from './itens.repository.js';
import { RedisCacheService } from '../common/redis-cache.service.js';

@Injectable()
export class ItensService {
  constructor(
    private readonly repository: ItensRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async create(createItenDto: CreateItenDto) {
    const novoItem = await this.repository.criar(createItenDto);
    await this.cache.limpar('itens:lista:');
    return novoItem;
  }

  async findAll(filtros?: FindItensQueryDto) {
    const chave = `itens:lista:${JSON.stringify(filtros ?? {})}`;
    return this.cache.consultar(chave, () => this.repository.listarComPaginacao(filtros));
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
    await this.cache.limpar('itens:lista:');
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
    await this.cache.limpar('itens:lista:');
    return { mensagem: 'Item removido com sucesso.' };
  }
}


