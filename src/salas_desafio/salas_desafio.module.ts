import { Module } from '@nestjs/common';
import { SalasDesafioService } from './salas_desafio.service.js';
import { SalasDesafioController } from './salas_desafio.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SalasDesafioController],
  providers: [SalasDesafioService],
  exports: [SalasDesafioService]
})
export class SalasDesafioModule {}
