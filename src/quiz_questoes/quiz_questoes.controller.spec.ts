import { Test, TestingModule } from '@nestjs/testing';
import { QuizQuestoesController } from './quiz_questoes.controller.js';
import { QuizQuestoesService } from './quiz_questoes.service.js';

describe('QuizQuestoesController', () => {
  let controller: QuizQuestoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizQuestoesController],
      providers: [QuizQuestoesService],
    }).compile();

    controller = module.get<QuizQuestoesController>(QuizQuestoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
