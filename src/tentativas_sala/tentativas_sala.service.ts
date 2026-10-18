import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTentativasSalaDto } from './dto/create-tentativas_sala.dto.js';
import { DesistirTentativaDto } from './dto/desistir-tentativas.dto.js';
import { FindTentativasQueryDto } from './dto/find-tentativas-query.dto.js';
import { ResponderTentativaDto } from './dto/responder-tentativa.dto.js';
import { TentativasSalaRepository } from './tentativas_sala.repository.js';

const STATUS_TENTATIVA = {
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  VITORIA: 'VITORIA',
  DERROTA: 'DERROTA',
} as const;

@Injectable()
export class TentativasSalaService {
  constructor(
    private readonly repository: TentativasSalaRepository,
  ) {}

  async create(salaId: number, personagemId: number, usuarioId: number) {
    if (salaId < 1 || personagemId < 1) {
      throw new BadRequestException('Os IDs da sala e do personagem devem ser positivos.');
    }

    const personagem = await this.validarAcessoSala(
      personagemId,
      salaId,
      usuarioId,
    );

    const vidaInicial = Math.min(personagem.vida_atual ?? 100, personagem.vida_maxima ?? 100);

    return this.repository.criar({
      personagem_id: personagemId,
      sala_id: salaId,
      vida_restante: vidaInicial,
    });
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

    if (updateDto.vida_restante !== undefined) {
      updateDto.vida_restante = Math.min(updateDto.vida_restante, 100);
    }

    return this.repository.atualizar(id, updateDto);
  }

  async remove(id: number) {
    await this.findById(id);
    await this.repository.remover(id);
    return { mensagem: 'Tentativa de sala removida com sucesso.' };
  }

  async validarAcessoSala(personagemId: number, salaId: number, usuarioId: number) {
    const personagem = await this.repository.buscarPersonagemCompleto(personagemId);
    const sala = await this.repository.buscarSalaComRankMinimo(salaId);

    if (!personagem) {
      throw new NotFoundException('Personagem informado não foi encontrado.');
    }

    if (!sala) {
      throw new NotFoundException('Sala de desafio informada não foi encontrada.');
    }

    if (personagem.usuario_id !== usuarioId) {
      throw new ForbiddenException('Este personagem não pertence ao usuário autenticado.');
    }

    if (sala.ranks && (!personagem.ranks || personagem.ranks.nivel_acesso < sala.ranks.nivel_acesso)) {
      throw new BadRequestException(`Senioridade insuficiente! Exige nível de acesso ${sala.ranks.nivel_acesso}.`);
    }

    const jaConcluiu = await this.repository.buscarTentativaConcluida(personagemId, salaId);
    if (jaConcluiu) {
      throw new BadRequestException('Esta sala já foi concluída! O grind de XP e moedas está bloqueado.');
    }

    return personagem;
  }

  calcularDano(fase: number, nivelAcessoPersonagem: number, maxNivelAcesso: number, topicoQuestao: string, atributoPenalidade?: string): number {
    const danoBase = 5 * fase;
    const multSenioridade = 1 + ((nivelAcessoPersonagem - 1) / Math.max(maxNivelAcesso - 1, 1));
    const isDesvantagem = !!atributoPenalidade && topicoQuestao === atributoPenalidade;
    const multFraqueza = isDesvantagem ? 2.0 : 1.0;

    return Math.floor(danoBase * multSenioridade * multFraqueza);
  }

  async responderQuestao(tentativaId: number, dto: ResponderTentativaDto, usuarioId: number) {
    const tentativa = await this.repository.buscarPorId(tentativaId);
    if (!tentativa || tentativa.status !== STATUS_TENTATIVA.EM_ANDAMENTO) {
      throw new BadRequestException('Tentativa inválida ou já encerrada.');
    }

    const personagem = await this.repository.buscarPersonagemCompleto(dto.personagem_id);
    if (!personagem) {
      throw new NotFoundException('Personagem informado não foi encontrado.');
    }

    if (personagem.usuario_id !== usuarioId) {
      throw new ForbiddenException('Este personagem não pertence ao usuário autenticado.');
    }

    const questao = await this.repository.buscarQuestaoPorId(dto.questao_id);
    if (!questao) {
      throw new NotFoundException('Questão não encontrada.');
    }

    const respostaEscolhida = dto.alternativa_escolhida.trim().toUpperCase();
    const respostaCorretaBD = questao.resposta_correta?.trim().toUpperCase();
    const acertou = respostaEscolhida === respostaCorretaBD;

    if (acertou) {
      await this.repository.atualizarTentativa(tentativaId, {
        acertos: { increment: 1 },
      });

      const sala = tentativa.salas_desafio;
      const isUltimaFase = dto.fase >= 5;

      if (isUltimaFase) {
        await this.repository.atualizarTentativa(tentativaId, { status: STATUS_TENTATIVA.VITORIA });
        await this.repository.recompensarPersonagem(
          dto.personagem_id,
          sala?.xp_recompensa ?? 100,
          sala?.moedas_recompensa ?? 50,
        );

        const checkFlawless = await this.verificarEasterEggFlawless(dto.personagem_id);

        return {
          resultado: 'CORRETO',
          mensagem: 'Parabéns! Você concluiu a sala com sucesso.',
          statusTentativa: STATUS_TENTATIVA.VITORIA,
          recompensas: {
            xp: sala?.xp_recompensa ?? 100,
            moedas: sala?.moedas_recompensa ?? 50,
          },
          ...(checkFlawless.conquistado && { easterEgg: checkFlawless.easterEgg }),
        };
      }

      return {
        resultado: 'CORRETO',
        mensagem: 'Resposta correta! Avance para a próxima fase.',
        statusTentativa: STATUS_TENTATIVA.EM_ANDAMENTO,
      };
    }

    const nivelAcesso = personagem.ranks?.nivel_acesso ?? 1;
    const penalidade = personagem.especializacoes?.atributo_penalidade;
    const dano = this.calcularDano(dto.fase, nivelAcesso, 5, questao.topico_atributo, penalidade);

    const vidaAtual = personagem.vida_atual ?? 100;
    const calculoVida = vidaAtual - dano;

    if (calculoVida <= 0) {
      await this.repository.atualizarVidaEStatusPersonagem(dto.personagem_id, 0);
      await this.repository.atualizarTentativa(tentativaId, {
        status: STATUS_TENTATIVA.DERROTA,
        vida_restante: 0,
        erros: { increment: 1 },
      });

      return {
        resultado: 'INCORRETO',
        danoSofrido: dano,
        vidaRestante: 0,
        statusTentativa: STATUS_TENTATIVA.DERROTA,
        mensagem: 'GAME OVER! Sua vida chegou a zero e a tentativa foi encerrada.',
      };
    }

    const vidaMaximaPermitida = personagem.vida_maxima ?? 100;
    const novaVida = Math.min(calculoVida, vidaMaximaPermitida);

    await this.repository.atualizarVidaEStatusPersonagem(dto.personagem_id, novaVida);
    await this.repository.atualizarTentativa(tentativaId, {
      vida_restante: novaVida,
      erros: { increment: 1 },
    });

    return {
      resultado: 'INCORRETO',
      danoSofrido: dano,
      vidaRestante: novaVida,
      statusTentativa: STATUS_TENTATIVA.EM_ANDAMENTO,
      mensagem: `Resposta incorreta! Você sofreu ${dano} pontos de dano.`,
    };
  }

  async desistirTentativa(tentativaId: number, dto: DesistirTentativaDto, usuarioId: number) {
    const tentativa = await this.repository.buscarPorId(tentativaId);

    if (!tentativa || tentativa.status !== STATUS_TENTATIVA.EM_ANDAMENTO) {
      throw new BadRequestException('Não é possível desistir de uma tentativa inativa ou já encerrada.');
    }

    const personagem = await this.repository.buscarPersonagemPorId(dto.personagem_id);
    if (!personagem) {
      throw new NotFoundException('Personagem informado não foi encontrado.');
    }

    if (personagem.usuario_id !== usuarioId) {
      throw new ForbiddenException('Este personagem não pertence ao usuário autenticado.');
    }

    await this.repository.atualizarTentativa(tentativaId, {
      status: STATUS_TENTATIVA.DERROTA,
    });

    return {
      statusTentativa: STATUS_TENTATIVA.DERROTA,
      mensagem: 'Você desistiu da tentativa. A rodada foi finalizada como derrota.',
    };
  }

  async verificarEasterEggFlawless(personagemId: number) {
    const vitoriaBoss = await this.repository.buscarVitoriaNoBossFinal(personagemId);

    if (!vitoriaBoss) {
      return {
        conquistado: false,
        mensagem: 'O personagem ainda não derrotou o Boss Final.',
      };
    }

    const totalErros = await this.repository.somarTotalErrosPersonagem(personagemId);

    if (totalErros === 0) {
      return {
        conquistado: true,
        easterEgg: '🏆 DEATHLESS VICTORY! Você concluiu a jornada com ZERO ERROS!',
      };
    }

    return {
      conquistado: false,
      mensagem: 'Boss derrotado, mas o personagem sofreu erros ao longo da jornada.',
    };
  }
}