import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizQuestoesRepository } from './quiz_questoes.repository.js';
import { CreateQuizQuestoesDto } from './dto/create-quiz_questoes.dto.js';
import { FindQuizQuestoesQueryDto } from './dto/find-quiz-questoes-query.dto.js';
import { UpdateQuizQuestoesDto } from './dto/update-quiz_questoes.dto.js';

@Injectable()
export class QuizQuestoesService {
  constructor(private readonly repository: QuizQuestoesRepository) {}

  async create(createDto: CreateQuizQuestoesDto) {
    const sala = await this.repository.buscarSalaPorId(createDto.sala_id);

    if (!sala) {
      throw new NotFoundException('A sala de desafio informada não foi encontrada.');
    }

    return this.repository.criar(createDto);
  }

  async findAll(filtros: FindQuizQuestoesQueryDto) {
    return this.repository.listarComFiltrosEPaginacao(filtros);
  }

  async findById(id: number) {
    const questao = await this.repository.buscarPorId(id);
    if (!questao) {
      throw new NotFoundException('Questão não encontrada.');
    }
    return questao;
  }

  async update(id: number, updateDto: UpdateQuizQuestoesDto) {
    await this.findById(id);

    if (updateDto.sala_id !== undefined) {
      const sala = await this.repository.buscarSalaPorId(updateDto.sala_id);
      if (!sala) {
        throw new NotFoundException('A sala de desafio informada não foi encontrada.');
      }
    }

    return this.repository.atualizar(id, updateDto);
  }

  async remove(id: number) {
    await this.findById(id);
    await this.repository.remover(id);
    return { mensagem: 'Questão removida com sucesso.' };
  }
}