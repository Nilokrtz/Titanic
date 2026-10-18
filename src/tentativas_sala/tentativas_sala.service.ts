import { Injectable, NotFoundException } from '@nestjs/common';
import { TentativasSalaRepository } from './tentativas_sala.repository.js';
import { CreateTentativasSalaDto } from './dto/create-tentativas_sala.dto.js';
import { FindTentativasQueryDto } from './dto/find-tentativas-query.dto.js';

@Injectable()
export class TentativasSalaService {
  constructor(private readonly repository: TentativasSalaRepository) {}

  async create(createDto: CreateTentativasSalaDto) {
    if (createDto.personagem_id) {
      const personagem = await this.repository.buscarPersonagemPorId(createDto.personagem_id);
      if (!personagem) {
        throw new NotFoundException('Personagem informado não foi encontrado.');
      }
    }

    if (createDto.sala_id) {
      const sala = await this.repository.buscarSalaPorId(createDto.sala_id);
      if (!sala) {
        throw new NotFoundException('Sala de desafio informada não foi encontrada.');
      }
    }

    return this.repository.criar(createDto);
  }

  async findAll(filtros: FindTentativasQueryDto) {
    return this.repository.listarComFiltrosEPaginacao(filtros);
  }

  async findById(id: number) {
    const tentativa = await this.repository.buscarPorId(id);
    if (!tentativa) {
      throw new NotFoundException('Tentativa de sala não encontrada.');
    }
    return tentativa;
  }

  async update(id: number, updateDto: CreateTentativasSalaDto) {
    await this.findById(id);

    if (updateDto.personagem_id !== undefined && updateDto.personagem_id !== null) {
      const personagem = await this.repository.buscarPersonagemPorId(updateDto.personagem_id);
      if (!personagem) {
        throw new NotFoundException('Personagem informado não foi encontrado.');
      }
    }

    if (updateDto.sala_id !== undefined && updateDto.sala_id !== null) {
      const sala = await this.repository.buscarSalaPorId(updateDto.sala_id);
      if (!sala) {
        throw new NotFoundException('Sala de desafio informada não foi encontrada.');
      }
    }

    return this.repository.atualizar(id, updateDto);
  }
  
  async remove(id: number) {
    await this.findById(id);
    await this.repository.remover(id);
    return { mensagem: 'Tentativa de sala removida com sucesso.' };
  }
}