import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SalasDesafioRepository } from './salas_desafio.repository.js';
import { CreateSalasDesafioDto } from './dto/create-salas_desafio.dto.js';
import { UpdateSalasDesafioDto } from './dto/update-salas_desafio.dto.js';
import { FindSalasQueryDto } from './dto/find-salas-query.dto.js';
import { RedisCacheService } from '../common/redis-cache.service.js';

@Injectable()
export class SalasDesafioService {
  constructor(
    private readonly repository: SalasDesafioRepository,
    private readonly cache: RedisCacheService,
  ) {}

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

    const sala = await this.repository.criar(createDto);
    await this.cache.limpar('salas:');
    return sala;
  }

  async findAll(filtros: FindSalasQueryDto) {
    const chave = `salas:lista:${JSON.stringify(filtros)}`;
    return this.cache.consultar(chave, () => this.repository.listarComFiltrosEPaginacao(filtros));
  }

  async findById(id: number){
    const chave = `salas:id:${id}`;
    const sala = await this.cache.consultar(chave, () => this.repository.buscarSalaPorId(id));
    if(!sala){
      throw new NotFoundException('Sala de desafio não encontrada')
    }
    return sala;
  }

  async update(id: number, updateDto: UpdateSalasDesafioDto) {
    
    await this.findById(id);

    if (updateDto.numero_sala !== undefined) {
      const salaComMesmoNumero = await this.repository.buscarPorNumeroSala(updateDto.numero_sala);
      if (salaComMesmoNumero && salaComMesmoNumero.id !== id) {
        throw new BadRequestException(`A sala número ${updateDto.numero_sala} já está cadastrada em outra sala.`);
      }
    }

    if (updateDto.rank_minimo_id !== undefined && updateDto.rank_minimo_id !== null) {
      const rank = await this.repository.buscarRankPorId(updateDto.rank_minimo_id);
      if (!rank) {
        throw new NotFoundException('Rank mínimo informado não foi encontrado.');
      }
    }

    const sala = await this.repository.atualizarSala(id, updateDto);
    await this.cache.limpar('salas:');
    await this.cache.limpar('questoes:lista:');
    return sala;
  }

  async remove(id: number) {
    const sala = await this.repository.buscarSalaPorId(id);

    if(!sala){
      throw new NotFoundException('Sala de desafio não encontrada')
    }

    await this.repository.remover(id);
    await this.cache.limpar('salas:');
    await this.cache.limpar('questoes:lista:');
    return { mensagem: 'Sala de desafio removida com sucesso.' };
  }
}
