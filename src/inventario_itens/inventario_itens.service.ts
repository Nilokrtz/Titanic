import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma, tipo_perfil } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInventarioItenDto } from './dto/create-inventario_iten.dto.js';
import { FindInventarioQueryDto } from './dto/find-inventario-query.dto.js';
import { UpdateInventarioItenDto } from './dto/update-inventario_iten.dto.js';
import { ComprarItemDto } from './dto/comprar-item.dto.js';
import { VenderItemDto } from './dto/vender-item.dto.js';
import { UsarItemDto } from './dto/usar-item.dto.js';

@Injectable()
export class InventarioItensService {
  constructor(private readonly prisma: PrismaService) {}

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

    const personagem = await this.prisma.personagens.findUnique({
      where: { id: personagemId },
    });

    if (!personagem) {
      throw new NotFoundException('Personagem não encontrado.');
    }

    if (usuarioId !== undefined) {
      const usuario = await this.prisma.usuarios.findUnique({
        where: { id: usuarioId },
        select: {
          perfis: { select: { nome: true } },
        },
      });

      const isOwner = personagem.usuario_id === usuarioId;
      const isAdmin = usuario?.perfis?.nome === tipo_perfil.ADMIN_PROFESSOR;

      if (!isOwner && !isAdmin) {
        throw new ForbiddenException(
          'Apenas o dono do personagem pode realizar compras.',
        );
      }
    }

    const item = await this.prisma.itens.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado na loja.');
    }

    if (item.tipo_efeito === 'EASTER_EGG') {
      throw new BadRequestException(
        'Itens lendários do tipo Easter Egg não estão disponíveis para compra.',
      );
    }

    const custoTotal = item.preco_moedas * quantidade;

    return this.prisma.$transaction(async (tx) => {
      const personagemTx = await tx.personagens.findUnique({
        where: { id: personagemId },
      });

      if (!personagemTx) {
        throw new NotFoundException('Personagem não encontrado.');
      }

      const saldoAtual = personagemTx.moedas ?? 0;
      if (saldoAtual < custoTotal) {
        throw new BadRequestException(
          `Saldo insuficiente. O item custa ${custoTotal} moeda(s), mas o personagem possui apenas ${saldoAtual} moeda(s). O saldo não pode ficar negativo.`,
        );
      }

      const inventarioAtual = await tx.inventario_itens.findMany({
        where: { personagem_id: personagemId },
      });

      const totalItensAtuais = inventarioAtual.reduce(
        (acc, curr) => acc + (curr.quantidade ?? 1),
        0,
      );

      if (totalItensAtuais + quantidade > 2) {
        throw new BadRequestException(
          `O personagem só pode carregar no máximo 2 itens no inventário. O inventário atual já possui ${totalItensAtuais} item(ns).`,
        );
      }

      const personagemAtualizado = await tx.personagens.update({
        where: { id: personagemId },
        data: {
          moedas: { decrement: custoTotal },
        },
      });

      const itemExistente = inventarioAtual.find(
        (inv) => inv.item_id === itemId,
      );

      let itemInventario;
      if (itemExistente) {
        itemInventario = await tx.inventario_itens.update({
          where: { id: itemExistente.id },
          data: {
            quantidade: (itemExistente.quantidade ?? 1) + quantidade,
          },
          include: { itens: true },
        });
      } else {
        itemInventario = await tx.inventario_itens.create({
          data: {
            personagem_id: personagemId,
            item_id: itemId,
            quantidade,
          },
          include: { itens: true },
        });
      }

      return {
        mensagem: 'Item comprado com sucesso.',
        item: {
          id: item.id,
          nome: item.nome,
          preco_unitario: item.preco_moedas,
          quantidade_comprada: quantidade,
          custo_total: custoTotal,
        },
        moedas_atuais: personagemAtualizado.moedas,
        total_itens_inventario: totalItensAtuais + quantidade,
        inventario: itemInventario,
      };
    });
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

    const personagem = await this.prisma.personagens.findUnique({
      where: { id: personagemId },
    });

    if (!personagem) {
      throw new NotFoundException('Personagem não encontrado.');
    }

    if (usuarioId !== undefined) {
      const usuario = await this.prisma.usuarios.findUnique({
        where: { id: usuarioId },
        select: { perfis: { select: { nome: true } } },
      });

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
      registro = await this.prisma.inventario_itens.findFirst({
        where: {
          id: inventarioId,
          personagem_id: personagemId,
        },
        include: { itens: true },
      });
    }

    if (!registro && itemId) {
      registro = await this.prisma.inventario_itens.findFirst({
        where: {
          item_id: itemId,
          personagem_id: personagemId,
        },
        include: { itens: true },
      });
    }

    if (!registro && inventarioId) {
      registro = await this.prisma.inventario_itens.findFirst({
        where: {
          item_id: inventarioId,
          personagem_id: personagemId,
        },
        include: { itens: true },
      });
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

    return this.prisma.$transaction(async (tx) => {
      const personagemAtualizado = await tx.personagens.update({
        where: { id: personagemId },
        data: {
          moedas: { increment: valorTotalRecebido },
        },
      });

      const quantidadeRestante = quantidadeAtual - quantidade;
      let inventarioRestante = null;

      if (quantidadeRestante > 0) {
        inventarioRestante = await tx.inventario_itens.update({
          where: { id: registro.id },
          data: { quantidade: quantidadeRestante },
          include: { itens: true },
        });
      } else {
        await tx.inventario_itens.delete({
          where: { id: registro.id },
        });
      }

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
        moedas_atuais: personagemAtualizado.moedas,
        quantidade_restante: quantidadeRestante,
        inventario: inventarioRestante,
      };
    });
  }

  async usarItem(
    personagemId: number,
    idOuItemId: number,
    usuarioId?: number,
    usarItemDto?: UsarItemDto,
  ) {
    const personagem = await this.prisma.personagens.findUnique({
      where: { id: personagemId },
    });

    if (!personagem) {
      throw new NotFoundException('Personagem não encontrado.');
    }

    if (usuarioId !== undefined) {
      const usuario = await this.prisma.usuarios.findUnique({
        where: { id: usuarioId },
        select: { perfis: { select: { nome: true } } },
      });

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

    const tentativaAtiva = await this.prisma.tentativas_sala.findFirst({
      where: {
        personagem_id: personagemId,
        status: 'EM_ANDAMENTO',
        ...(usarItemDto?.tentativa_id
          ? { id: usarItemDto.tentativa_id }
          : {}),
      },
      include: {
        salas_desafio: true,
      },
    });

    const salaVerificar =
      tentativaAtiva?.salas_desafio ??
      (usarItemDto?.sala_id
        ? await this.prisma.salas_desafio.findUnique({
            where: { id: usarItemDto.sala_id },
          })
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

    let registro = await this.prisma.inventario_itens.findFirst({
      where: {
        id: idOuItemId,
        personagem_id: personagemId,
      },
      include: { itens: true },
    });

    if (!registro) {
      registro = await this.prisma.inventario_itens.findFirst({
        where: {
          item_id: idOuItemId,
          personagem_id: personagemId,
        },
        include: { itens: true },
      });
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

    return this.prisma.$transaction(async (tx) => {
      let detalheEfeito = '';
      let vidaAtualizada = personagem.vida_atual ?? 100;

      if (
        efeito.includes('CURA') ||
        efeito.includes('VIDA') ||
        efeito.includes('HEAL')
      ) {
        const vidaMaxima = personagem.vida_maxima ?? 100;
        const curaEfetiva = valorEfeito > 0 ? valorEfeito : 30;
        vidaAtualizada = Math.min(vidaAtualizada + curaEfetiva, vidaMaxima);
        const vidaRecuperada = vidaAtualizada - (personagem.vida_atual ?? 100);

        await tx.personagens.update({
          where: { id: personagemId },
          data: { vida_atual: vidaAtualizada },
        });

        if (tentativaAtiva) {
          const vidaRestanteTentativa = Math.min(
            tentativaAtiva.vida_restante + vidaRecuperada,
            vidaMaxima,
          );
          await tx.tentativas_sala.update({
            where: { id: tentativaAtiva.id },
            data: { vida_restante: vidaRestanteTentativa },
          });
        }

        detalheEfeito = `Recuperou ${vidaRecuperada} ponto(s) de vida. Vida atual: ${vidaAtualizada}/${vidaMaxima}.`;
      } else if (
        efeito.includes('PULO') ||
        efeito.includes('SKIP')
      ) {
        const pulosAdicionados = valorEfeito > 0 ? valorEfeito : 1;
        if (tentativaAtiva) {
          await tx.tentativas_sala.update({
            where: { id: tentativaAtiva.id },
            data: {
              pulos_restantes:
                (tentativaAtiva.pulos_restantes ?? 0) + pulosAdicionados,
            },
          });
          detalheEfeito = `Adicionou ${pulosAdicionados} pulo(s) na tentativa ativa.`;
        } else {
          detalheEfeito = `Item de pulo ativado com sucesso (+${pulosAdicionados} pulo).`;
        }
      } else if (
        efeito.includes('ELIMINA') ||
        efeito.includes('CARTAS')
      ) {
        const qtdEliminar = valorEfeito > 0 ? valorEfeito : 2;
        detalheEfeito = `Elimina até ${qtdEliminar} alternativas incorretas da questão atual.`;
      } else {
        detalheEfeito = `Efeito '${itemCatalogo.tipo_efeito}' ativado com valor ${valorEfeito}.`;
      }

      const quantidadeRestante = quantidadeAtual - 1;
      let inventarioRestante = null;

      if (quantidadeRestante > 0) {
        inventarioRestante = await tx.inventario_itens.update({
          where: { id: registro.id },
          data: { quantidade: quantidadeRestante },
          include: { itens: true },
        });
      } else {
        await tx.inventario_itens.delete({
          where: { id: registro.id },
        });
      }

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
    });
  }

  create(createInventarioItenDto: CreateInventarioItenDto) {
    return 'This action adds a new inventarioIten';
  }

  findAll() {
    return `This action returns all inventarioItens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventarioIten`;
  }

  update(id: number, updateInventarioItenDto: UpdateInventarioItenDto) {
    return `This action updates a #${id} inventarioIten`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventarioIten`;
  }

  async listarMochila(personagemId: number, filtros: FindInventarioQueryDto) {
    const condicoes: Prisma.inventario_itensWhereInput = {
      personagem_id: personagemId,
    };

    if (filtros.quantidade_minima !== undefined) {
      condicoes.quantidade = {
        gte: filtros.quantidade_minima,
      };
    }

    if (filtros.tipo_efeito) {
      condicoes.itens = {
        tipo_efeito: {
          contains: filtros.tipo_efeito,
          mode: 'insensitive',
        },
      };
    }

    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 10;

    const total = await this.prisma.inventario_itens.count({
      where: condicoes,
    });

    const items = await this.prisma.inventario_itens.findMany({
      where: condicoes,
      include: { itens: true },
      orderBy: { id: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, page, limit, total };
  }

  async descartarItem(personagemId: number, id: number) {
    const registro = await this.prisma.inventario_itens.findFirst({
      where: {
        id,
        personagem_id: personagemId,
      },
      include: { itens: true },
    });

    if (!registro || !registro.itens) {
      throw new NotFoundException(
        'Item não encontrado no inventário deste personagem.',
      );
    }

    const valorReembolso = Math.floor(registro.itens.preco_moedas * 0.9);

    return this.prisma.$transaction(async (tx) => {
      const personagemAtualizado = await tx.personagens.update({
        where: { id: personagemId },
        data: {
          moedas: { increment: valorReembolso },
        },
      });

      if ((registro.quantidade ?? 1) > 1) {
        const atualizado = await tx.inventario_itens.update({
          where: { id: registro.id },
          data: { quantidade: (registro.quantidade ?? 1) - 1 },
        });

        return {
          mensagem: 'Uma unidade do item foi vendida com 10% de taxa.',
          moedas_atuais: personagemAtualizado.moedas,
          inventario: atualizado,
        };
      }

      await tx.inventario_itens.delete({
        where: { id: registro.id },
      });

      return {
        mensagem: 'Item vendido completamente da mochila com 10% de taxa.',
        moedas_atuais: personagemAtualizado.moedas,
      };
    });
  }
}
