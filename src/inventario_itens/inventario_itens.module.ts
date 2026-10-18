import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { InventarioItensService } from './inventario_itens.service.js';
import { InventarioItensController } from './inventario_itens.controller.js';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [InventarioItensController],
  providers: [InventarioItensService],
  exports: [InventarioItensService],
})
export class InventarioItensModule {}
