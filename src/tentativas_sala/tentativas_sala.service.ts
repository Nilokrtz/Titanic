import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TentativasSalaRepository } from './tentativas_sala.repository.js';
import { CreateTentativasSalaDto } from './dto/create-tentativas_sala.dto.js';
import { FindTentativasQueryDto } from './dto/find-tentativas-query.dto.js';

@Injectable()
export class TentativasSalaService {
  constructor(private readonly repository: TentativasSalaRepository) {}

  async create(salaId: number, personagemId: number, usuarioId: number) {
    if (salaId < 1 || personagemId < 1) {
      throw new BadRequestException('Os IDs da sala e do personagem devem ser positivos.');
    }

    const personagem = await this.validarAcessoSala(
      personagemId,
      salaId,
      usuarioId,
    );

    return this.repository.criar({
      personagem_id: personagemId,
      sala_id: salaId,
      vida_restante: personagem.vida_atual ?? 100,
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

    const isDesvantagem = atributoPenalidade && topicoQuestao === atributoPenalidade;
    const multFraqueza = isDesvantagem ? 2.0 : 1.0;

    return Math.floor(danoBase * multSenioridade * multFraqueza);
  }

  async registrarErroEReceberDano(tentativaId: number, personagemId: number, fase: number, topicoQuestao: string) {
    const personagem = await this.repository.buscarPersonagemCompleto(personagemId);
    if (!personagem) throw new BadRequestException('Personagem não encontrado.');

    const nivelAcesso = personagem.ranks?.nivel_acesso ?? 1;
    const penalidade = personagem.especializacoes?.atributo_penalidade;

    const dano = this.calcularDano(fase, nivelAcesso, 5, topicoQuestao, penalidade);
    const novaVida = (personagem.vida_atual ?? 100) - dano;

    if (novaVida <= 0) {
      await this.repository.atualizarVidaEStatusPersonagem(personagemId, 0);
      await this.repository.atualizarTentativa(tentativaId, {
        status: 'DERROTA',
        vida_restante: 0,
      });

      return { gameOver: true, mensagem: 'GAME OVER! Sua vida chegou a zero e a tentativa foi encerrada.' };
    }

    await this.repository.atualizarVidaEStatusPersonagem(personagemId, novaVida);
    await this.repository.atualizarTentativa(tentativaId, { vida_restante: novaVida });

    return { gameOver: false, danoSofrido: dano, vidaRestante: novaVida };
  }

  async verificarEasterEggFlawless(personagemId: number) {
    const totalErros = await this.repository.somarTotalErrosPersonagem(personagemId);

    if (totalErros === 0) {
      return {
        conquistado: true,
        easterEgg: ' DEATHLESS VICTORY! Você concluiu a jornada com ZERO ERROS!',
      };
    }

    return { conquistado: false };
  }
}
