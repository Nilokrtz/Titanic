import { Module } from '@nestjs/common';
import { EspecializacoesService } from './especializacoes.service.js';
import { EspecializacoesController } from './especializacoes.controller.js';

@Module({
  controllers: [EspecializacoesController],
  providers: [EspecializacoesService],
})
export class EspecializacoesModule {}
