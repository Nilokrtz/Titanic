import { Module } from '@nestjs/common';
import { PermissoesService } from './permissoes.service.js';
import { PermissoesController } from './permissoes.controller.js';
import { PermissoesRepository } from './permissoes.repository.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PermissoesController],
  providers: [PermissoesService, PermissoesRepository],
  exports: [PermissoesService, PermissoesRepository],
})
export class PermissoesModule {}
