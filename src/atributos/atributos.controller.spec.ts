import { Test, TestingModule } from '@nestjs/testing';
import { AtributosController } from './atributos.controller.js';
import { AtributosService } from './atributos.service.js';

describe('AtributosController', () => {
  let controller: AtributosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtributosController],
      providers: [AtributosService],
    }).compile();

    controller = module.get<AtributosController>(AtributosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
