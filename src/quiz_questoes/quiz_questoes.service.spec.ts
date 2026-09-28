import { Test, TestingModule } from '@nestjs/testing';
import { QuizQuestoesService } from './quiz_questoes.service.js';

describe('QuizQuestoesService', () => {
  let service: QuizQuestoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizQuestoesService],
    }).compile();

    service = module.get<QuizQuestoesService>(QuizQuestoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
