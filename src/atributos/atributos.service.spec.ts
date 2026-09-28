import { Test, TestingModule } from '@nestjs/testing';
import { AtributosService } from './atributos.service.js';

describe('AtributosService', () => {
  let service: AtributosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtributosService],
    }).compile();

    service = module.get<AtributosService>(AtributosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
