import { Test, TestingModule } from '@nestjs/testing';
import { TentativasSalaService } from './tentativas_sala.service.js';

describe('TentativasSalaService', () => {
  let service: TentativasSalaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TentativasSalaService],
    }).compile();

    service = module.get<TentativasSalaService>(TentativasSalaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
