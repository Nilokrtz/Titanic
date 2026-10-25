import { Test, TestingModule } from '@nestjs/testing';
import { CassinoService } from './cassino.service.js';

describe('CassinoService', () => {
  let service: CassinoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CassinoService],
    }).compile();

    service = module.get<CassinoService>(CassinoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
