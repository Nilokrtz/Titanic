import { Module } from '@nestjs/common';
import { TentativasSalaController } from './tentativas_sala.controller.js';
import { TentativasSalaService } from './tentativas_sala.service.js';
import { TentativasSalaRepository } from './tentativas_sala.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [TentativasSalaController],
  providers: [TentativasSalaService, TentativasSalaRepository],
  exports: [TentativasSalaService, TentativasSalaRepository],
})
export class TentativasSalaModule {}