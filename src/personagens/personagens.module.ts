import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisCacheModule } from '../common/redis-cache.module.js';
import { PersonagensService } from './personagens.service.js';
import { PersonagensController } from './personagens.controller.js';
import { PersonagensRepository } from './personagens.repository.js';

@Module({
  imports: [AuthModule, PrismaModule, RedisCacheModule],
  controllers: [PersonagensController],
  providers: [PersonagensService, PersonagensRepository],
})
export class PersonagensModule {}
