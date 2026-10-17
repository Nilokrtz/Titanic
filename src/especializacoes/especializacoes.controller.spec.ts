import { Test, TestingModule } from '@nestjs/testing';
import { EspecializacoesController } from './especializacoes.controller.js';
import { EspecializacoesService } from './especializacoes.service.js';

describe('EspecializacoesController', () => {
  let controller: EspecializacoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EspecializacoesController],
      providers: [EspecializacoesService],
    }).compile();

    controller = module.get<EspecializacoesController>(EspecializacoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
