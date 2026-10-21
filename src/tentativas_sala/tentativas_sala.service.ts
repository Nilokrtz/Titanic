import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTentativasDto } from './dto/create-tentativas_sala.dto.js';
import { DesistirTentativaDto } from './dto/desistir-tentativas.dto.js';
import { FindTentativasQueryDto } from './dto/find-tentativas-query.dto.js';
import { ResponderTentativaDto } from './dto/responder-tentativa.dto.js';
import { TentativasSalaRepository } from './tentativas_sala.repository.js';
import { UpdateTentativasDto } from './dto/update-tentativas_sala.dto.js';

@Injectable()
export class TentativasSalaService {
  constructor(private readonly repository: TentativasSalaRepository) {}

  async create(data : CreateTentativasDto) {
    if (data.sala_id == null || data.personagem_id == null || data.usuario_id == null || data.personagem_id < 1 || data.usuario_id < 1) {
      throw new BadRequestException('Os IDs da sala, do personagem e do usuário devem ser positivos.');
    }
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

  async update(id: number, data: UpdateTentativasDto) {
    await this.findById(id);

    if (data.personagem_id !== undefined && data.personagem_id !== null) {
      const personagem = await this.repository.buscarPersonagemPorId(data.personagem_id);
      if (!personagem) {
        throw new NotFoundException('Personagem informado não foi encontrado.');
      }
    }

    if (data.sala_id !== undefined && data.sala_id !== null) {
      const sala = await this.repository.buscarSalaPorId(data.sala_id);
      if (!sala) {
        throw new NotFoundException('Sala de desafio informada não foi encontrada.');
      }
    }

    if (data.vida_restante !== undefined) {
      data.vida_restante = Math.min(data.vida_restante, 100);
    }

    return this.repository.atualizar(id, data);
  }

  async remove(id: number) {
    await this.findById(id);
    await this.repository.remover(id);
    return { mensagem: 'Tentativa de sala removida com sucesso.' };
  }

}