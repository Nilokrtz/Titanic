import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PersonagensService } from './personagens.service.js';
import { PersonagensController } from './personagens.controller.js';
import { PersonagensRepository } from './personagens.repository.js';
import { RankingCacheService } from './ranking-cache.service.js';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [PersonagensController],
  providers: [PersonagensService, PersonagensRepository, RankingCacheService],
})
export class PersonagensModule {}
