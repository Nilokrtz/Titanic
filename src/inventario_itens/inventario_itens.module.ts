import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { InventarioItensService } from './inventario_itens.service.js';
import { InventarioItensController } from './inventario_itens.controller.js';
import { InventarioItensRepository } from './inventario_itens.repository.js';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [InventarioItensController],
  providers: [InventarioItensService, InventarioItensRepository],
  exports: [InventarioItensService, InventarioItensRepository],
})
export class InventarioItensModule {}
