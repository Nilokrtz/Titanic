import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizQuestoesRepository } from './quiz_questoes.repository.js';
import { CreateQuizQuestoesDto } from './dto/create-quiz_questoes.dto.js';
import { FindQuizQuestoesQueryDto } from './dto/find-quiz-questoes-query.dto.js';
import { UpdateQuizQuestoesDto } from './dto/update-quiz_questoes.dto.js';

@Injectable()
export class QuizQuestoesService {
  constructor(private readonly repository: QuizQuestoesRepository) {}

  async create(data: CreateQuizQuestoesDto) {
    const sala = await this.repository.buscarSalaPorId(data.sala_id);

    if (!sala) {
      throw new NotFoundException('A sala de desafio informada não foi encontrada.');
    }

    return await this.repository.criar(data);
  }

  async findAll(filtros: FindQuizQuestoesQueryDto) {
    return this.repository.listarComFiltrosEPaginacao(filtros);
  }

  async findById(id: number) {
    const quiz = await this.repository.buscarPorId(id);
    if (!quiz) {
      throw new NotFoundException('Quiz não encontrado.');
    }
    return quiz;
  }

  async update(id: number, data: UpdateQuizQuestoesDto) {
    await this.findById(id);

    if (data.sala_id !== undefined) {
      const sala = await this.repository.buscarSalaPorId(data.sala_id);
      if (!sala) {
        throw new NotFoundException('A sala de desafio informada não foi encontrada.');
      }
    }

    return await this.repository.atualizar(id, data);
  }

  async remove(id: number) {
    await this.findById(id);
    await this.repository.remover(id);
    return { mensagem: 'Quiz removido com sucesso.' };
  }

  async ExclusãoDeOpcaoBaseadoNaProeficiencia(questaoId: number, proeficienciaPersonagem?: string) {
    const questao = await this.repository.buscarQuestaoPorId(questaoId);
    if (!questao) {
      throw new NotFoundException('Questão não encontrada.');
    }

    if (!proeficienciaPersonagem) {
      return questao;
    }
    else{
      const opcoes = ['A', 'B', 'C', 'D']
      const opcaoCerta = questao.resposta_correta;
      let indiceRandomizado: number = Math.floor(Math.random() * opcoes.length);
      do{
        indiceRandomizado = Math.floor(Math.random() * opcoes.length);
        console.log('repetiu aqui');
      }while(opcoes[indiceRandomizado] === opcaoCerta)  

      return opcoes.filter(opcao => opcao !== opcoes[indiceRandomizado]);
    }
  }
}
