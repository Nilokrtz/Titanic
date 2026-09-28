import { Module } from '@nestjs/common';
import { QuizQuestoesService } from './quiz_questoes.service.js';
import { QuizQuestoesController } from './quiz_questoes.controller.js';

@Module({
  controllers: [QuizQuestoesController],
  providers: [QuizQuestoesService],
})
export class QuizQuestoesModule {}
