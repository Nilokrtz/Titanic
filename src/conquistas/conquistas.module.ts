import { Module } from '@nestjs/common';
import { ConquistasService } from './conquistas.service.js';
import { ConquistasController } from './conquistas.controller.js';
import { ConquistasRepository } from './conquista.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [ConquistasController],
  providers: [ConquistasService, ConquistasRepository],
  imports: [PrismaModule, AuthModule],
})
export class ConquistasModule {}
