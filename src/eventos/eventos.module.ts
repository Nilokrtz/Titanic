import { Module } from '@nestjs/common';
import { EventosController } from './eventos.controller.js';

@Module({
  controllers: [EventosController],
})
export class EventosModule {}