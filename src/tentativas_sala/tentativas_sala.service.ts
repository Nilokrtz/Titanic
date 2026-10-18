import { Injectable, NotFoundException } from '@nestjs/common';
import { TentativasSalaRepository } from './tentativas_sala.repository.js';
import { CreateTentativasSalaDto } from './dto/create-tentativas_sala.dto.js';

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
}