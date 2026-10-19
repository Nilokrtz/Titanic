import { Module } from '@nestjs/common';
import { SalasDesafioService } from './salas_desafio.service.js';
import { SalasDesafioController } from './salas_desafio.controller.js';
import { SalasDesafioRepository } from './salas_desafio.repository.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisCacheModule } from '../common/redis-cache.module.js';

@Module({
  imports: [PrismaModule, AuthModule, RedisCacheModule],
  controllers: [SalasDesafioController],
  providers: [SalasDesafioService, SalasDesafioRepository],
  exports: [SalasDesafioService, SalasDesafioRepository],
})
export class SalasDesafioModule {}
