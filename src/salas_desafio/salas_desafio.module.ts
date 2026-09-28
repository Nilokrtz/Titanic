import { Module } from '@nestjs/common';
import { SalasDesafioService } from './salas_desafio.service.js';
import { SalasDesafioController } from './salas_desafio.controller.js';

@Module({
  controllers: [SalasDesafioController],
  providers: [SalasDesafioService],
})
export class SalasDesafioModule {}
