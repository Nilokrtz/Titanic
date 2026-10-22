import { Module } from '@nestjs/common';
import { ConquistasService } from './conquistas.service.js';
import { ConquistasController } from './conquistas.controller.js';

@Module({
  controllers: [ConquistasController],
  providers: [ConquistasService],
})
export class ConquistasModule {}
