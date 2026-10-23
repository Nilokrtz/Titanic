import { Injectable, NotFoundException  } from '@nestjs/common';
import { CreateConquistaDto } from './dto/create-conquista.dto.js';
import { UpdateConquistaDto } from './dto/update-conquista.dto.js';
import { FindConquistasQueryDto } from './dto/find-conquistas-query.dto.js';
import { ConquistasRepository } from './conquista.repository.js';

@Injectable()
export class ConquistasService {
  constructor(private readonly repository: ConquistasRepository) {}
  
  create(createConquistaDto: CreateConquistaDto) {
    return 'This action adds a new conquista';
  }

  async findAll(query: FindConquistasQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { dados, total } = await this.repository.listarComPaginacao(query);
    const totalPaginas = Math.ceil(total / limit);
    return {
      dados,
      total,
      page,
      limit,
      totalPaginas
    };
  }

  async findOne(id: number) {
    const conquista = await this.repository.buscarPorId(id);
    if (!conquista) {
      throw new NotFoundException(`Conquista com ID ${id} nao encontrada.`);
    }
    return conquista;
  }

  async update(id: number, updateConquistaDto: UpdateConquistaDto) {
    const conquista = await this.repository.buscarPorId(id);
    if (!conquista) {
      throw new NotFoundException(`Conquista com ID ${id} nao encontrada.`);
    }
    return await this.repository.atualizar(id, updateConquistaDto);
  }

  async remove(id: number) {
    const conquista = await this.repository.buscarPorId(id);
    if (!conquista) {
      throw new NotFoundException(`Conquista com ID ${id} nao encontrada.`);
    }
    return await this.repository.remover(id);
  }
}
