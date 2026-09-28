import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizQuestoesService } from './quiz_questoes.service.js';
import { CreateQuizQuestoeDto } from './dto/create-quiz_questoe.dto.js';
import { UpdateQuizQuestoeDto } from './dto/update-quiz_questoe.dto.js';

@Controller('quiz-questoes')
export class QuizQuestoesController {
  constructor(private readonly quizQuestoesService: QuizQuestoesService) {}

  @Post()
  create(@Body() createQuizQuestoeDto: CreateQuizQuestoeDto) {
    return this.quizQuestoesService.create(createQuizQuestoeDto);
  }

  @Get()
  findAll() {
    return this.quizQuestoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizQuestoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizQuestoeDto: UpdateQuizQuestoeDto) {
    return this.quizQuestoesService.update(+id, updateQuizQuestoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizQuestoesService.remove(+id);
  }
}
