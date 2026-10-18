import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class EventosController {

  @EventPattern('tentativa_finalizada_event')
  async processarTentativaFinalizada(
    @Payload() data: { tentativaId: number; personagemId: number; status: 'VITORIA' | 'DERROTA'; erros: number },
  ) {
    if (data.status === 'VITORIA') {
      console.log(`[RabbitMQ] Vitória na sala! Creditando XP e moedas para o personagem ${data.personagemId}.`);
      
      if (data.erros === 0) {
        console.log(`[RabbitMQ] Rota Flawless! Checando elegibilidade para Conquista Deathless do personagem ${data.personagemId}.`);
      }
    } else {
      console.log(`[RabbitMQ] Derrota registrada para a tentativa ${data.tentativaId}. Computando métricas de dificuldade.`);
    }
  }

  @EventPattern('resposta_errada_event')
  async processarRespostaErrada(
    @Payload() data: { personagemId: number; questaoId: number; topicoAtributo: string; danoSofrido: number },
  ) {
    console.log(
      `[RabbitMQ] Jogador ${data.personagemId} errou questão de ${data.topicoAtributo}. Dano aplicado: ${data.danoSofrido}.`,
    );
  }

  @EventPattern('item_transacao_event')
  async processarTransacaoItem(
    @Payload() data: { personagemId: number; itemId: number; valor: number; acao: 'COMPRA' | 'VENDA' },
  ) {
    console.log(
      `[RabbitMQ] Transação registrada: Personagem ${data.personagemId} realizou ${data.acao} do item ${data.itemId} por ${data.valor} moedas.`,
    );
  }

  @EventPattern('item_usado_event')
  async processarUsoItem(
    @Payload() data: { personagemId: number; itemId: number; salaId: number; isBossFinal: boolean },
  ) {
    console.log(`[RabbitMQ] Item ${data.itemId} consumido pelo personagem ${data.personagemId} na sala ${data.salaId}.`);
  }

  @EventPattern('rank_promocao_event')
  async processarPromocaoRank(
    @Payload() data: { personagemId: number; novoRankId: number; nivelAcesso: number },
  ) {
    console.log(`[RabbitMQ] Personagem ${data.personagemId} promovido para o Rank ${data.novoRankId} (Nível ${data.nivelAcesso}).`);
  }
}