import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePersonagenDto } from './dto/create-personagen.dto.js';

@Injectable()
export class PersonagensRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarUsuarioPorId(usuarioId: number) {
    return this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
    });
  }

  async buscarEspecializacaoPorId(especializacaoId: number) {
    return this.prisma.especializacoes.findUnique({
      where: { id: especializacaoId },
    });
  }

  async buscarRankInicial() {
    return this.prisma.ranks.findUnique({
      where: { nome: 'Estagiário' },
    });
  }

  async buscarPersonagemPorUsuarioId(usuarioId: number) {
    return this.prisma.personagens.findUnique({
      where: { usuario_id: usuarioId },
    });
  }

  async buscarPersonagemPorNome(nome: string) {
    return this.prisma.personagens.findUnique({
      where: { nome },
    });
  }

  async criar(data: CreatePersonagenDto, usuarioId: number, rankId: number) {
    return this.prisma.personagens.create({
      data: {
        ...data,
        usuario_id: usuarioId,
        rank_id: rankId,
      },
      include: {
        especializacoes: true,
        ranks: true,
      },
    });
  }
}