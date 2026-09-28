import { Injectable } from '@nestjs/common';
import { CreateQuizQuestoeDto } from './dto/create-quiz_questoe.dto.js';
import { UpdateQuizQuestoeDto } from './dto/update-quiz_questoe.dto.js';

@Injectable()
export class QuizQuestoesService {
  create(createQuizQuestoeDto: CreateQuizQuestoeDto) {
    return 'This action adds a new quizQuestoe';
  }

  findAll() {
    return `This action returns all quizQuestoes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quizQuestoe`;
  }

  update(id: number, updateQuizQuestoeDto: UpdateQuizQuestoeDto) {
    return `This action updates a #${id} quizQuestoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} quizQuestoe`;
  }
}
