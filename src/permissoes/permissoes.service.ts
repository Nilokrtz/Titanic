import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PermissoesRepository } from './permissoes.repository.js';
import { CreatePermissoeDto } from './dto/create-permissoe.dto.js';
import { FindPermissoesQueryDto } from './dto/find-permissoes-query.dto.js';
import { UpdatePermissoeDto } from './dto/update-permissoe.dto.js';

@Injectable()
export class PermissoesService {
  constructor(private readonly repository: PermissoesRepository) {}

  async create(dados: CreatePermissoeDto) {
    const permissaoExistente = await this.repository.buscarPorSlug(dados.slug);
    if (permissaoExistente) {
      throw new BadRequestException(`Permissão com slug '${dados.slug}' já existe.`);
    }
    return this.repository.criar(dados);
  }

  async findAll(query: FindPermissoesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { dados, total } = await this.repository.listarComPaginacao(query);
    const totalPaginas = Math.ceil(total / limit);
    return {
      dados,
      total,
      page,
      totalPaginas,
      limit,
    };
  }

  async findOne(id: number) {
    const permissao = await this.repository.buscarPorId(id);
    if (!permissao) {
      throw new NotFoundException(`Permissão com ID ${id} não encontrada.`);
    }
    return permissao;
  }

  async update(id: number, updatePermissoeDto: UpdatePermissoeDto) {
    await this.findOne(id); 

    if (updatePermissoeDto.slug) {
    const existente = await this.repository.buscarPorSlug(updatePermissoeDto.slug);
    if (existente && existente.id !== id) {
      throw new BadRequestException(`Permissão com slug '${updatePermissoeDto.slug}' já existe.`);
    }
  }
    return this.repository.atualizar(id, updatePermissoeDto);
  }

  async remove(id: number) {
    await this.findOne(id);

    const vinculosAtivos = await this.repository.contarPerfisVinculados(id);
    if (vinculosAtivos > 0) {
      throw new BadRequestException(`Não é possível remover a permissão com ID ${id} pois ela está vinculada a perfis.`);
    }
    await this.repository.remover(id);
    return { message: `Permissão com ID ${id} removida com sucesso.` };
  }
}
