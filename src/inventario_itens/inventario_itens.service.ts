import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { tipo_perfil } from '../generated/prisma/client.js';
import { InventarioItensRepository } from './inventario_itens.repository.js';
import { FindInventarioQueryDto } from './dto/find-inventario-query.dto.js';
import { ComprarItemDto } from './dto/comprar-item.dto.js';
import { VenderItemDto } from './dto/vender-item.dto.js';
import { UsarItemDto } from './dto/usar-item.dto.js';

@Injectable()
export class InventarioItensService {
  constructor(private readonly repository: InventarioItensRepository) {}

  async comprarItem(
    personagemId: number,
    comprarItemDto: ComprarItemDto,
    usuarioId?: number,
  ) {
    const itemId = comprarItemDto.item_id ?? comprarItemDto.itemId;
    if (!itemId) {
      throw new BadRequestException('O ID do item (item_id) é obrigatório.');
    }

    const quantidade = comprarItemDto.quantidade ?? 1;
    if (quantidade <= 0) {
      throw new BadRequestException(
        'A quantidade a comprar deve ser maior que zero.',
      );
    }

    if (quantidade > 2) {
      throw new BadRequestException(
        'O personagem só pode carregar no máximo 2 itens no inventário.',
      );
    }

    const personagem = await this.repository.buscarPersonagemPorId(personagemId);

    if (!personagem) {
      throw new NotFoundException('Personagem não encontrado.');
    }

    if (usuarioId !== undefined) {
      const usuario = await this.repository.buscarUsuarioComPerfil(usuarioId);

      const isOwner = personagem.usuario_id === usuarioId;
      const isAdmin = usuario?.perfis?.nome === tipo_perfil.ADMIN_PROFESSOR;

      if (!isOwner && !isAdmin) {
        throw new ForbiddenException(
          'Apenas o dono do personagem pode realizar compras.',
        );
      }
    }

    const item = await this.repository.buscarItemPorId(itemId);

    if (!item) {
      throw new NotFoundException('Item não encontrado na loja.');
    }

    if (item.tipo_efeito === 'EASTER_EGG') {
      throw new BadRequestException(
        'Itens lendários do tipo Easter Egg não estão disponíveis para compra.',
      );
    }

    const custoTotal = item.preco_moedas * quantidade;
    const saldoAtual = personagem.moedas ?? 0;

    if (saldoAtual < custoTotal) {
      throw new BadRequestException(
        `Saldo insuficiente. O item custa ${custoTotal} moeda(s), mas o personagem possui apenas ${saldoAtual} moeda(s). O saldo não pode ficar negativo.`,
      );
    }

    const inventarioAtual = await this.repository.listarItensDoPersonagem(personagemId);

    const totalItensAtuais = inventarioAtual.reduce(
      (acc, curr) => acc + (curr.quantidade ?? 1),
      0,
    );

    if (totalItensAtuais + quantidade > 2) {
      throw new BadRequestException(
        `O personagem só pode carregar no máximo 2 itens no inventário. O inventário atual já possui ${totalItensAtuais} item(ns).`,
      );
    }

    const itemExistente = inventarioAtual.find(
      (inv) => inv.item_id === itemId,
    );

    const resultado = await this.repository.salvarCompraTransacao(
      personagemId,
      item.id,
      quantidade,
      custoTotal,
      itemExistente?.id,
      itemExistente?.quantidade ?? undefined,
    );

    return {
      mensagem: 'Item comprado com sucesso.',
      item: {
        id: item.id,
        nome: item.nome,
        preco_unitario: item.preco_moedas,
        quantidade_comprada: quantidade,
        custo_total: custoTotal,
      },
      moedas_atuais: resultado.moedas_atuais,
      total_itens_inventario: totalItensAtuais + quantidade,
      inventario: resultado.inventario,
    };
  }

  async venderItem(
    personagemId: number,
    venderItemDto: VenderItemDto,
    usuarioId?: number,
  ) {
    const itemId = venderItemDto.item_id ?? venderItemDto.itemId;
    const inventarioId =
      venderItemDto.inventario_id ??
      venderItemDto.inventarioId ??
      venderItemDto.id;

    if (!itemId && !inventarioId) {
      throw new BadRequestException(
        'Informe o item_id ou inventario_id do item a ser vendido.',
      );
    }

    const quantidade = venderItemDto.quantidade ?? 1;
    if (quantidade <= 0) {
      throw new BadRequestException(
        'A quantidade a vender deve ser maior que zero.',
      );
    }

    const personagem = await this.repository.buscarPersonagemPorId(personagemId);

    if (!personagem) {
      throw new NotFoundException('Personagem não encontrado.');
    }

    if (usuarioId !== undefined) {
      const usuario = await this.repository.buscarUsuarioComPerfil(usuarioId);

      const isOwner = personagem.usuario_id === usuarioId;
      const isAdmin = usuario?.perfis?.nome === tipo_perfil.ADMIN_PROFESSOR;

      if (!isOwner && !isAdmin) {
        throw new ForbiddenException(
          'Apenas o dono do personagem pode vender itens do seu inventário.',
        );
      }
    }

    let registro = null;

    if (inventarioId) {
      registro = await this.repository.buscarPorIdEPersonagem(inventarioId, personagemId);
    }

    if (!registro && itemId) {
      registro = await this.repository.buscarPorItemEPersonagem(itemId, personagemId);
    }

    if (!registro && inventarioId) {
      registro = await this.repository.buscarPorItemEPersonagem(inventarioId, personagemId);
    }

    if (!registro || !registro.itens) {
      throw new NotFoundException(
        'Item não encontrado no inventário deste personagem.',
      );
    }

    const itemCatalogo = registro.itens;

    if (itemCatalogo.tipo_efeito === 'EASTER_EGG') {
      throw new BadRequestException(
        'Itens lendários do tipo Easter Egg não podem ser vendidos.',
      );
    }

    const quantidadeAtual = registro.quantidade ?? 1;
    if (quantidadeAtual < quantidade) {
      throw new BadRequestException(
        `Quantidade insuficiente no inventário. O personagem possui ${quantidadeAtual} unidade(s) e tentou vender ${quantidade}.`,
      );
    }

    const precoOriginalUnitario = itemCatalogo.preco_moedas;
    const valorUnitarioVenda = Math.floor(precoOriginalUnitario * 0.9);
    const valorTotalRecebido = valorUnitarioVenda * quantidade;
    const quantidadeRestante = quantidadeAtual - quantidade;

    const resultado = await this.repository.salvarVendaTransacao(
      personagemId,
      registro.id,
      quantidadeRestante,
      valorTotalRecebido,
    );

    return {
      mensagem: 'Venda realizada com sucesso com aplicação de 10% de taxa.',
      item_vendido: {
        id: itemCatalogo.id,
        nome: itemCatalogo.nome,
        preco_original: precoOriginalUnitario,
        valor_unitario_venda: valorUnitarioVenda,
        quantidade_vendida: quantidade,
        valor_total_recebido: valorTotalRecebido,
      },
      moedas_atuais: resultado.moedas_atuais,
      quantidade_restante: quantidadeRestante,
      inventario: resultado.inventario,
    };
  }

  async usarItem(
    personagemId: number,
    idOuItemId: number,
    usuarioId?: number,
    usarItemDto?: UsarItemDto,
  ) {
    const personagem = await this.repository.buscarPersonagemPorId(personagemId);

    if (!personagem) {
      throw new NotFoundException('Personagem não encontrado.');
    }

    if (usuarioId !== undefined) {
      const usuario = await this.repository.buscarUsuarioComPerfil(usuarioId);

      const isOwner = personagem.usuario_id === usuarioId;
      const isAdmin = usuario?.perfis?.nome === tipo_perfil.ADMIN_PROFESSOR;

      if (!isOwner && !isAdmin) {
        throw new ForbiddenException(
          'Apenas o dono do personagem pode usar itens do seu inventário.',
        );
      }
    }

    if ((personagem.vida_atual ?? 100) <= 0) {
      throw new BadRequestException(
        'Personagem derrotado (vida zerada / Game Over). Não é possível usar itens.',
      );
    }

    const tentativaAtiva = await this.repository.buscarTentativaAtivaDoPersonagem(
      personagemId,
      usarItemDto?.tentativa_id,
    );

    const salaVerificar =
      tentativaAtiva?.salas_desafio ??
      (usarItemDto?.sala_id
        ? await this.repository.buscarSalaPorId(usarItemDto.sala_id)
        : null);

    if (salaVerificar) {
      const nomeSala = salaVerificar.nome ?? '';
      const chefeSala = salaVerificar.chefe_nome ?? '';
      const isBossFinal =
        /boss\s*final|chefe\s*final/i.test(nomeSala) ||
        /boss\s*final|chefe\s*final/i.test(chefeSala) ||
        (/boss/i.test(nomeSala) && /final/i.test(nomeSala)) ||
        (/boss/i.test(chefeSala) && /final/i.test(chefeSala));

      if (isBossFinal) {
        throw new BadRequestException(
          'É proibido usar qualquer item durante a batalha na sala do Boss Final.',
        );
      }
    }

    let registro = await this.repository.buscarPorIdEPersonagem(idOuItemId, personagemId);

    if (!registro) {
      registro = await this.repository.buscarPorItemEPersonagem(idOuItemId, personagemId);
    }

    if (!registro || !registro.itens) {
      throw new NotFoundException(
        'Item não encontrado no inventário deste personagem.',
      );
    }

    const itemCatalogo = registro.itens;

    if (itemCatalogo.tipo_efeito === 'EASTER_EGG') {
      throw new BadRequestException(
        'Itens lendários do tipo Easter Egg são itens comemorativos e não podem ser consumidos.',
      );
    }

    const quantidadeAtual = registro.quantidade ?? 1;
    if (quantidadeAtual <= 0) {
      throw new BadRequestException(
        'Quantidade do item no inventário insuficiente para uso.',
      );
    }

    const efeito = itemCatalogo.tipo_efeito?.toUpperCase() ?? '';
    const valorEfeito = itemCatalogo.valor_efeito ?? 0;

    let detalheEfeito = '';
    let vidaAtualizada = personagem.vida_atual ?? 100;
    let novaVidaPersonagem: number | undefined;
    let novaVidaTentativa: number | undefined;
    let novosPulosTentativa: number | undefined;

    if (
      efeito.includes('CURA') ||
      efeito.includes('VIDA') ||
      efeito.includes('HEAL')
    ) {
      const vidaMaxima = personagem.vida_maxima ?? 100;
      const curaEfetiva = valorEfeito > 0 ? valorEfeito : 30;
      vidaAtualizada = Math.min(vidaAtualizada + curaEfetiva, vidaMaxima);
      const vidaRecuperada = vidaAtualizada - (personagem.vida_atual ?? 100);
      novaVidaPersonagem = vidaAtualizada;

      if (tentativaAtiva) {
        novaVidaTentativa = Math.min(
          tentativaAtiva.vida_restante + vidaRecuperada,
          vidaMaxima,
        );
      }

      detalheEfeito = `Recuperou ${vidaRecuperada} ponto(s) de vida. Vida atual: ${vidaAtualizada}/${vidaMaxima}.`;
    } else if (efeito.includes('PULO') || efeito.includes('SKIP')) {
      const pulosAdicionados = valorEfeito > 0 ? valorEfeito : 1;
      if (tentativaAtiva) {
        novosPulosTentativa =
          (tentativaAtiva.pulos_restantes ?? 0) + pulosAdicionados;
        detalheEfeito = `Adicionou ${pulosAdicionados} pulo(s) na tentativa ativa.`;
      } else {
        detalheEfeito = `Item de pulo ativado com sucesso (+${pulosAdicionados} pulo).`;
      }
    } else if (efeito.includes('ELIMINA') || efeito.includes('CARTAS')) {
      const qtdEliminar = valorEfeito > 0 ? valorEfeito : 2;
      detalheEfeito = `Elimina até ${qtdEliminar} alternativas incorretas da questão atual.`;
    } else {
      detalheEfeito = `Efeito '${itemCatalogo.tipo_efeito}' ativado com valor ${valorEfeito}.`;
    }

    const quantidadeRestante = quantidadeAtual - 1;
    const inventarioRestante = await this.repository.consumirItemTransacao(
      personagemId,
      registro.id,
      quantidadeRestante,
      novaVidaPersonagem,
      tentativaAtiva?.id,
      novaVidaTentativa,
      novosPulosTentativa,
    );

    return {
      mensagem: `Item '${itemCatalogo.nome}' utilizado com sucesso.`,
      efeito_aplicado: {
        item_id: itemCatalogo.id,
        nome: itemCatalogo.nome,
        tipo_efeito: itemCatalogo.tipo_efeito,
        valor_efeito: itemCatalogo.valor_efeito,
        detalhe: detalheEfeito,
      },
      vida_atual: vidaAtualizada,
      quantidade_restante: quantidadeRestante,
      inventario: inventarioRestante,
    };
  }


  async findOne(personagemId: number, id: number) {
    const registro = await this.repository.buscarPorIdEPersonagem(
      id,
      personagemId,
    );

    if (!registro) {
      throw new NotFoundException(
        'Item nao encontrado no inventario deste personagem.',
      );
    }

    return registro;
  }

  async listarMochila(personagemId: number, filtros: FindInventarioQueryDto) {
     return this.repository.listarMochilaPaginada(personagemId, filtros);
  }

  async descartarItem(personagemId: number, id: number) {
    const registro = await this.repository.buscarPorIdEPersonagem(
      id,
      personagemId,
    );

    if (!registro || !registro.itens) {
      throw new NotFoundException(
        'Item não encontrado no inventário deste personagem.',
      );
    }

    const valorReembolso = Math.floor(registro.itens.preco_moedas * 0.9);
    const quantidadeAtual = registro.quantidade ?? 1;
    const quantidadeRestante = quantidadeAtual - 1;

    const resultado = await this.repository.salvarVendaTransacao(
      personagemId,
      registro.id,
      quantidadeRestante,
      valorReembolso,
    );

    if (quantidadeAtual > 1) {
      return {
        mensagem: 'Uma unidade do item foi vendida com 10% de taxa.',
        moedas_atuais: resultado.moedas_atuais,
        inventario: resultado.inventario,
      };
    }

    return {
      mensagem: 'Item vendido completamente da mochila com 10% de taxa.',
      moedas_atuais: resultado.moedas_atuais,
    };
  }
}
