import { Module } from '@nestjs/common';
import { CassinoService } from './cassino.service.js';
import { CassinoController } from './cassino.controller.js';
import { CassinoRepository } from './cassino.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [CassinoController],
  providers: [CassinoService, CassinoRepository],
  imports: [PrismaModule, AuthModule]
})
export class CassinoModule {}
