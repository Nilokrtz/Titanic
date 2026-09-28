import { Test, TestingModule } from '@nestjs/testing';
import { SalasDesafioController } from './salas_desafio.controller.js';
import { SalasDesafioService } from './salas_desafio.service.js';

describe('SalasDesafioController', () => {
  let controller: SalasDesafioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalasDesafioController],
      providers: [SalasDesafioService],
    }).compile();

    controller = module.get<SalasDesafioController>(SalasDesafioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
