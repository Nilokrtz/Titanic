import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PerfisService } from './perfis.service.js';
import { PerfisController } from './perfis.controller.js';
import { PerfisRepository } from './perfis.repository.js';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [PerfisController],
  providers: [PerfisService, PerfisRepository],
})
export class PerfisModule {}
