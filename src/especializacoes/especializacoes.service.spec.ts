import { Test, TestingModule } from '@nestjs/testing';
import { EspecializacoesService } from './especializacoes.service.js';

describe('EspecializacoesService', () => {
  let service: EspecializacoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EspecializacoesService],
    }).compile();

    service = module.get<EspecializacoesService>(EspecializacoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
