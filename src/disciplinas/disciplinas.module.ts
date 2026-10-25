import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { RedisCacheModule } from '../common/redis-cache.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { DisciplinasController } from './disciplinas.controller.js';
import { DisciplinasRepository } from './disciplinas.repository.js';
import { DisciplinasService } from './disciplinas.service.js';

@Module({
  imports: [PrismaModule, AuthModule, RedisCacheModule],
  controllers: [DisciplinasController],
  providers: [DisciplinasService, DisciplinasRepository],
  exports: [DisciplinasService, DisciplinasRepository],
})
export class DisciplinasModule {}
