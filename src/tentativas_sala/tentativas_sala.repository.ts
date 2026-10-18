import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTentativasSalaDto } from './dto/create-tentativas_sala.dto.js';

@Injectable()
export class TentativasSalaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPersonagemPorId(personagemId: number) {
    return this.prisma.personagens.findUnique({
      where: { id: personagemId },
    });
  }

  async buscarSalaPorId(salaId: number) {
    return this.prisma.salas_desafio.findUnique({
      where: { id: salaId },
    });
  }

  async criar(data: CreateTentativasSalaDto) {
    return this.prisma.tentativas_sala.create({
      data: {
        sala_id: data.sala_id,
        personagem_id: data.personagem_id,
        questao_atual_id: data.questao_atual_id,
        vida_restante: data.vida_restante,
        status: data.status ?? 'EM_ANDAMENTO',
        acertos: data.acertos ?? 0,
        erros: data.erros ?? 0,
        pulos_restantes: data.pulos_restantes ?? 1,
      },
      include: { personagens: true, salas_desafio: true, quiz_questoes: true }
    });
  }
}