import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SalasDesafioRepository } from './salas_desafio.repository.js';
import { CreateSalasDesafioDto } from './dto/create-salas_desafio.dto.js';
import { UpdateSalasDesafioDto } from './dto/update-salas_desafio.dto.js';
import { FindSalasQueryDto } from './dto/find-salas-query.dto.js';

@Injectable()
export class SalasDesafioService {
  constructor(private readonly repository: SalasDesafioRepository) {}

  async create(data: CreateSalasDesafioDto) {
    const salaExistente = await this.repository.buscarPorNumeroSala(data.numero_sala);
    if (salaExistente) {
      throw new BadRequestException('A sala já está cadastrada.');
    }

    if (data.rank_minimo_id) {
      const rank = await this.repository.buscarRankPorId(data.rank_minimo_id);
      if (!rank) {
        throw new NotFoundException('Rank mínimo informado não foi encontrado.');
      }
    }

    if (data.disciplina_id) {
      await this.validarDisciplina(data.disciplina_id);
    }

    return await this.repository.criar(data);
  }

  async findAll(filtros: FindSalasQueryDto) {
    return this.repository.listarComFiltrosEPaginacao(filtros);
  }

  async findById(id: number){
    const sala = await this.repository.buscarSalaPorId(id);
    if(!sala){
      throw new NotFoundException('Sala de desafio não foi encontrada')
    }
    return sala;
  }

  async update(id: number, data: UpdateSalasDesafioDto) {
    await this.findById(id);

    if (data.numero_sala !== undefined) {
      const salaComMesmoNumero = await this.repository.buscarPorNumeroSala(data.numero_sala);
      if (salaComMesmoNumero && salaComMesmoNumero.id !== id) {
        throw new BadRequestException(`Essa sala já está cadastrada em outra sala.`);
      }
    }

    if (data.rank_minimo_id !== undefined && data.rank_minimo_id !== null) {
      const rank = await this.repository.buscarRankPorId(data.rank_minimo_id);
      if (!rank) {
        throw new NotFoundException('Rank mínimo informado não foi encontrado.');
      }
    }

    if (data.disciplina_id !== undefined && data.disciplina_id !== null) {
      await this.validarDisciplina(data.disciplina_id);
    }

    return await this.repository.atualizarSala(id, data);
  }

  async remove(id: number) {
    const sala = await this.repository.buscarSalaPorId(id);

    if(!sala){
      throw new NotFoundException('Sala de desafio não foi encontrada')
    }

    await this.repository.remover(id);
    return { mensagem: 'Sala de desafio removida com sucesso.' };
  }

  private async validarDisciplina(disciplinaId: number) {
    const disciplina = await this.repository.buscarDisciplinaPorId(disciplinaId);
    if (!disciplina) {
      throw new NotFoundException('Disciplina informada não foi encontrada.');
    }

    if (disciplina.ativo === false) {
      throw new BadRequestException(
        'Não é possível vincular uma sala a uma disciplina inativa.',
      );
    }
  }
}
