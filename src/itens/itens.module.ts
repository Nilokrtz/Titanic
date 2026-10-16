import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ItensService } from './itens.service.js';
import { ItensController } from './itens.controller.js';


@Module({
  imports: [PrismaModule], 
  controllers: [ItensController],
  providers: [ItensService],
})
export class ItensModule {}
