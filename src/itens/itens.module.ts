import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisCacheModule } from '../common/redis-cache.module.js';
import { ItensService } from './itens.service.js';
import { ItensController } from './itens.controller.js';
import { ItensRepository } from './itens.repository.js';

@Module({
  imports: [AuthModule, PrismaModule, RedisCacheModule],
  controllers: [ItensController],
  providers: [ItensService, ItensRepository],
  exports: [ItensService, ItensRepository],
})
export class ItensModule {}
