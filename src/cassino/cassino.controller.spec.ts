import { Test, TestingModule } from '@nestjs/testing';
import { CassinoController } from './cassino.controller.js';
import { CassinoService } from './cassino.service.js';

describe('CassinoController', () => {
  let controller: CassinoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CassinoController],
      providers: [CassinoService],
    }).compile();

    controller = module.get<CassinoController>(CassinoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
