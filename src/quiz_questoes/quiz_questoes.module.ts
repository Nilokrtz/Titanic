import { Module } from '@nestjs/common';
import { QuizQuestoesService } from './quiz_questoes.service.js';
import { QuizQuestoesController } from './quiz_questoes.controller.js';
import { QuizQuestoesRepository } from './quiz_questoes.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { RedisCacheModule } from '../common/redis-cache.module.js';

@Module({
  imports: [PrismaModule,AuthModule,RedisCacheModule],
  controllers: [QuizQuestoesController],
  providers: [QuizQuestoesService, QuizQuestoesRepository],
  exports: [QuizQuestoesService, QuizQuestoesRepository],
})
export class QuizQuestoesModule {}
