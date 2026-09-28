import { Module } from '@nestjs/common';
import { RanksService } from './ranks.service.js';
import { RanksController } from './ranks.controller.js';

@Module({
  controllers: [RanksController],
  providers: [RanksService],
})
export class RanksModule {}
