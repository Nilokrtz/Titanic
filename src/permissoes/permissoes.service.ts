import { Injectable, BadRequestException } from '@nestjs/common';
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

  findAll() {
    return `This action returns all permissoes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permissoe`;
  }

  update(id: number, updatePermissoeDto: UpdatePermissoeDto) {
    return `This action updates a #${id} permissoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} permissoe`;
  }
}
