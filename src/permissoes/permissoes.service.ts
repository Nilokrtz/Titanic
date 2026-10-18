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

  update(id: number, updatePermissoeDto: UpdatePermissoeDto) {
    return `This action updates a #${id} permissoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} permissoe`;
  }
}
