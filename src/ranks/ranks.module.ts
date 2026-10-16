import { Module } from '@nestjs/common';
import { RanksService } from './ranks.service.js';
import { RanksController } from './ranks.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  controllers: [RanksController],
  providers: [RanksService],
  imports: [PrismaModule],
})
export class RanksModule {}
