import { Module } from '@nestjs/common';
import { AtributosService } from './atributos.service.js';
import { AtributosController } from './atributos.controller.js';

@Module({
  controllers: [AtributosController],
  providers: [AtributosService],
})
export class AtributosModule {}
