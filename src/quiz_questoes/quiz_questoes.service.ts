import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizQuestoesRepository } from './quiz_questoes.repository.js';
import { CreateQuizQuestoesDto } from './dto/create-quiz_questoes.dto.js';
import { FindQuizQuestoesQueryDto } from './dto/find-quiz-questoes-query.dto.js';
import { UpdateQuizQuestoesDto } from './dto/update-quiz_questoes.dto.js';
import { RedisCacheService } from '../common/redis-cache.service.js';

type Alternativa = { chave: string; texto: string };

@Injectable()
export class QuizQuestoesService {
  constructor(
    private readonly repository: QuizQuestoesRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async create(createDto: CreateQuizQuestoesDto) {
    const sala = await this.repository.buscarSalaPorId(createDto.sala_id);

    if (!sala) {
      throw new NotFoundException('A sala de desafio informada não foi encontrada.');
    }

    const questao = await this.repository.criar(createDto);
    await this.cache.limpar('questoes:lista:');
    return questao;
  }

  async findAll(filtros: FindQuizQuestoesQueryDto) {
    const chave = `questoes:lista:${JSON.stringify(filtros)}`;
    return this.cache.consultar(chave, () => this.repository.listarComFiltrosEPaginacao(filtros));
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

    const questao = await this.repository.atualizar(id, updateDto);
    await this.cache.limpar('questoes:lista:');
    return questao;
  }

  async remove(id: number) {
    await this.findById(id);
    await this.repository.remover(id);
    await this.cache.limpar('questoes:lista:');
    return { mensagem: 'Questão removida com sucesso.' };
  }

  async obterQuestaoFormatada(questaoId: number, atributoFocoPersonagem?: string) {
    const questao = await this.repository.buscarQuestaoPorId(questaoId);
    if (!questao) {
      throw new NotFoundException('Questão não encontrada.');
    }

    const isEspecialista =
      !!atributoFocoPersonagem && questao.topico_atributo === atributoFocoPersonagem;

    const alternativasCompletas: Alternativa[] = [
      { chave: 'A', texto: questao.opcao_a },
      { chave: 'B', texto: questao.opcao_b },
      { chave: 'C', texto: questao.opcao_c },
      { chave: 'D', texto: questao.opcao_d },
    ];

    if (!isEspecialista) {
      return {
        id: questao.id,
        enunciado: questao.enunciado,
        alternativas: alternativasCompletas,
        isEspecialista: false,
      };
    }

    const letraCorreta = questao.resposta_correta?.toUpperCase();

    const alternativaCorreta =
      alternativasCompletas.find((alt) => alt.chave === letraCorreta) || alternativasCompletas[0];

    const alternativasIncorretas = alternativasCompletas.filter(
      (alt) => alt.chave !== alternativaCorreta.chave,
    );

    const incorretasEmbaralhadas = [...alternativasIncorretas].sort(() => Math.random() - 0.5);
    const incorretasSelecionadas = incorretasEmbaralhadas.slice(0, 2);

    const tresOpcoesEmbaralhadas = [alternativaCorreta, ...incorretasSelecionadas].sort(
      () => Math.random() - 0.5,
    );

    const tresOpcoes = tresOpcoesEmbaralhadas.map((item: Alternativa, index: number) => {
      const novasChaves = ['A', 'B', 'C'];
      return {
        chave: novasChaves[index],
        texto: item.texto,
        chaveOriginal: item.chave, 
      };
    });

    return {
      id: questao.id,
      enunciado: questao.enunciado,
      alternativas: tresOpcoes,
      isEspecialista: true,
    };
  }
}
