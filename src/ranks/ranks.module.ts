import { Module } from '@nestjs/common';
import { RanksService } from './ranks.service.js';
import { RanksController } from './ranks.controller.js';
import { RanksRepository } from './ranks.repository.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisCacheModule } from '../common/redis-cache.module.js';

@Module({
  imports: [PrismaModule, AuthModule, RedisCacheModule],
  controllers: [RanksController],
  providers: [RanksService, RanksRepository],
  exports: [RanksRepository, RanksService],
})
export class RanksModule {}
