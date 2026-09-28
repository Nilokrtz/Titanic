import { Test, TestingModule } from '@nestjs/testing';
import { TentativasSalaController } from './tentativas_sala.controller.js';
import { TentativasSalaService } from './tentativas_sala.service.js';

describe('TentativasSalaController', () => {
  let controller: TentativasSalaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TentativasSalaController],
      providers: [TentativasSalaService],
    }).compile();

    controller = module.get<TentativasSalaController>(TentativasSalaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
