import { Module } from '@nestjs/common';
import { InventarioItensService } from './inventario_itens.service.js';
import { InventarioItensController } from './inventario_itens.controller.js';

@Module({
  controllers: [InventarioItensController],
  providers: [InventarioItensService],
})
export class InventarioItensModule {}
