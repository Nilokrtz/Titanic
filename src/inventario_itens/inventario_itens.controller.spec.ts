import { Test, TestingModule } from '@nestjs/testing';
import { InventarioItensController } from './inventario_itens.controller.js';
import { InventarioItensService } from './inventario_itens.service.js';

describe('InventarioItensController', () => {
  let controller: InventarioItensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventarioItensController],
      providers: [InventarioItensService],
    }).compile();

    controller = module.get<InventarioItensController>(InventarioItensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
