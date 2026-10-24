import { Module } from '@nestjs/common';
import { CassinoService } from './cassino.service.js';
import { CassinoController } from './cassino.controller.js';

@Module({
  controllers: [CassinoController],
  providers: [CassinoService],
})
export class CassinoModule {}
