import { Module } from '@nestjs/common';
import { PerfisService } from './perfis.service.js';
import { PerfisController } from './perfis.controller.js';

@Module({
  controllers: [PerfisController],
  providers: [PerfisService],
})
export class PerfisModule {}
