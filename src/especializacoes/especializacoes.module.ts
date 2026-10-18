import { Module } from '@nestjs/common';
import { EspecializacoesService } from './especializacoes.service.js';
import { EspecializacoesController } from './especializacoes.controller.js';
import { EspecializacoesRepository } from './especializacoes.repository.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [EspecializacoesController],
  providers: [EspecializacoesService, EspecializacoesRepository],
  exports: [EspecializacoesService, EspecializacoesRepository],
})
export class EspecializacoesModule {}
