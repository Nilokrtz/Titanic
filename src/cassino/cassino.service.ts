import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCassinoDto } from './dto/create-cassino.dto.js';
import { UpdateCassinoDto } from './dto/update-cassino.dto.js';
import { FindCassinoQueryDto } from './dto/find-cassino-query.dto.js';
import { CassinoRepository } from './cassino.repository.js';

@Injectable()
export class CassinoService {
  constructor(private readonly repository: CassinoRepository) {}

  async create(dados: CreateCassinoDto) {
    const opcaoExiste = await this.repository.buscarPorNome(dados.nome);
    if(opcaoExiste){
      throw new BadRequestException(`Opção '${dados.nome}' já existe.`)
    }
    return await this.repository.criar(dados);
  }

  async findAll(query: FindCassinoQueryDto) {
    const page = query;page ?? 1
    const limit = query.limit ?? 10

    const { dados, total} = await this.repository.listarComPaginacao(query);
    const totalPaginas = Math.ceil(total/limit)

    return{
      dados,
      total,
      page,
      limit,
      totalPaginas
    };
  }

  async findOne(id: number) {
    const opcao = await this.repository.buscarPorId(id)
    if(!opcao){
      throw new NotFoundException(`Opção com ID ${id} não encontrada.`)
    }
    return opcao;
  }

  async update(id: number, updateCassinoDto: UpdateCassinoDto) {
    await this.findOne(id);
    if(updateCassinoDto.nome !== undefined){
      const opcaoComMesmoNome = await this.repository.buscarPorNome(updateCassinoDto.nome);
      if(opcaoComMesmoNome && opcaoComMesmoNome.id !== id){
        throw new BadRequestException(`A opção com o nome "${updateCassinoDto.nome}" já existe.`)
      }
    }
    return await this.repository.atualizar(id, updateCassinoDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.repository.remover(id);
  }

  async apostar(personagemId: number) {
    const CUSTO_APOSTA = 20;

    const personagem = await this.repository.buscarPersonagemPorId(personagemId);
    if (!personagem) {
      throw new BadRequestException(`Personagem com ID ${personagemId} não encontrado.`);
    }

    if ((personagem.moedas ?? 0) < CUSTO_APOSTA) {
      throw new BadRequestException(
        `Saldo insuficiente. Você precisa de pelo menos ${CUSTO_APOSTA} moedas para apostar.`,
      );
    }

    let saldoAtual = (personagem.moedas ?? 0) - CUSTO_APOSTA;

    const opcoesCassino = await this.repository.buscarTodasOpcoes();
    if (opcoesCassino.length === 0) {
      throw new BadRequestException('O cassino não possui opções de prêmios cadastradas.');
    }

    const somaPorcentagens = opcoesCassino.reduce(
      (soma, opcao) => soma + opcao.chance_porcentagem,
      0,
    );

    const numeroSorteado = Math.floor(Math.random() * somaPorcentagens) + 1;

    let acumulado = 0;
    let opcaoSorteada = opcoesCassino[0];

    for (const opcao of opcoesCassino) {
      acumulado += opcao.chance_porcentagem;
      if (numeroSorteado <= acumulado) {
        opcaoSorteada = opcao;
        break;
      }
    }

    let resultado = '';
    let itemGanho: string | null = null;

    if (opcaoSorteada.tipo_recompensa === 'NADA') {
      resultado = `[${opcaoSorteada.nome}] ${opcaoSorteada.descricao ?? 'Você perdeu a aposta!'}`;
    } else if (opcaoSorteada.tipo_recompensa === 'MOEDAS') {
      saldoAtual += opcaoSorteada.valor_recompensa;
      resultado = `[${opcaoSorteada.nome}] ${opcaoSorteada.descricao ?? `Você ganhou ${opcaoSorteada.valor_recompensa} moedas!`}`;
    } else if (opcaoSorteada.tipo_recompensa === 'ITEM') {
      const todosItens = await this.repository.buscarTodosItens();

      if (todosItens.length === 0) {
        saldoAtual += 30;
        resultado = 'Você tirou um item, mas não há itens no banco! Receba 30 moedas no lugar.';
      } else {
        const itemSorteado = todosItens[Math.floor(Math.random() * todosItens.length)];
        const valorItem = itemSorteado.preco_moedas ?? 20;

        const inventarioAtual = await this.repository.buscarInventarioPersonagem(personagemId);
        const totalItensNoInventario = inventarioAtual.reduce((total, registro) => total + (registro.quantidade ?? 0), 0);

        if (totalItensNoInventario >= 2) {
          saldoAtual += valorItem;
          resultado = `Você tirou o item '${itemSorteado.nome}'! Como seu inventário está cheio, ganhe o valor dele em moedas (+${valorItem} moedas).`;
        } else {
          itemGanho = itemSorteado.nome;
          resultado = `Parabéns! Você teve uma sorte grande e ganhou o item: ${itemSorteado.nome}!`;

          const itemExistente = await this.repository.buscarItemNoInventario(
            personagemId,
            itemSorteado.id,
          );

          if (itemExistente) {
            await this.repository.incrementarQuantidadeItem(
              itemExistente.id,
              itemExistente.quantidade ?? 1,
            );
          } else {
            await this.repository.adicionarNovoItemInventario(
              personagemId,
              itemSorteado.id,
            );
          }
        }
      }
    }

    await this.repository.atualizarMoedasPersonagem(personagemId, saldoAtual);

    return {
      personagem_id: personagemId,
      mensagem: resultado,
      opcao_sorteada: opcaoSorteada.nome,
      numero_sorteado: numeroSorteado,
      moedas_restantes: saldoAtual,
      item_recebido: itemGanho,
    };
  }
}
