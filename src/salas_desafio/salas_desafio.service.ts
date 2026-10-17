import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SalasDesafioRepository } from './salas_desafio.repository.js';
import { CreateSalasDesafioDto } from './dto/create-salas_desafio.dto.js';

@Injectable()
export class SalasDesafioService {
  constructor(private readonly repository: SalasDesafioRepository) {}

  async create(createDto: CreateSalasDesafioDto) {
    const salaExistente = await this.repository.buscarPorNumeroSala(createDto.numero_sala);
    if (salaExistente) {
      throw new BadRequestException(`A sala número ${createDto.numero_sala} já está cadastrada.`);
    }

    if (createDto.rank_minimo_id) {
      const rank = await this.repository.buscarRankPorId(createDto.rank_minimo_id);
      if (!rank) {
        throw new NotFoundException('Rank mínimo informado não foi encontrado.');
      }
    }

    return this.repository.criar(createDto);
  }
}