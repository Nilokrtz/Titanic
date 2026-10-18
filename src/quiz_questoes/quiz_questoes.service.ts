import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizQuestoesRepository } from './quiz_questoes.repository.js';
import { CreateQuizQuestoesDto } from './dto/create-quiz_questoes.dto.js';

@Injectable()
export class QuizQuestoesService {
  constructor(private readonly repository: QuizQuestoesRepository) {}

  async create(createDto: CreateQuizQuestoesDto) {
    const sala = await this.repository.buscarSalaPorId(createDto.sala_id);
    
    if (!sala) {
      throw new NotFoundException('A sala de desafio informada não foi encontrada.');
    }

    return this.repository.criar(createDto);
  }
}