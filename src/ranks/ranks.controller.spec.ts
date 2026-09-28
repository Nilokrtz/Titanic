import { Test, TestingModule } from '@nestjs/testing';
import { RanksController } from './ranks.controller.js';
import { RanksService } from './ranks.service.js';

describe('RanksController', () => {
  let controller: RanksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RanksController],
      providers: [RanksService],
    }).compile();

    controller = module.get<RanksController>(RanksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
