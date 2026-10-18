import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateQuizQuestoesDto } from './dto/create-quiz_questoes.dto.js';

@Injectable()
export class QuizQuestoesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarSalaPorId(salaId: number) {
    return this.prisma.salas_desafio.findUnique({
      where: { id: salaId },
    });
  }
  
  async criar(data: CreateQuizQuestoesDto) {
    return this.prisma.quiz_questoes.create({
      data,
      include: { salas_desafio: true }
    });
  }
}