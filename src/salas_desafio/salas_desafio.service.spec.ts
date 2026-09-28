import { Test, TestingModule } from '@nestjs/testing';
import { SalasDesafioService } from './salas_desafio.service.js';

describe('SalasDesafioService', () => {
  let service: SalasDesafioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalasDesafioService],
    }).compile();

    service = module.get<SalasDesafioService>(SalasDesafioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
