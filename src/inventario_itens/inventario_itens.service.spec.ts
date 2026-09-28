import { Test, TestingModule } from '@nestjs/testing';
import { InventarioItensService } from './inventario_itens.service.js';

describe('InventarioItensService', () => {
  let service: InventarioItensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventarioItensService],
    }).compile();

    service = module.get<InventarioItensService>(InventarioItensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
