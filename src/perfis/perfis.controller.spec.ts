import { Test, TestingModule } from '@nestjs/testing';
import { PerfisController } from './perfis.controller.js';
import { PerfisService } from './perfis.service.js';

describe('PerfisController', () => {
  let controller: PerfisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfisController],
      providers: [PerfisService],
    }).compile();

    controller = module.get<PerfisController>(PerfisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
