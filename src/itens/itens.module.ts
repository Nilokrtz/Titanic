import { Module } from '@nestjs/common';
import { ItensService } from './itens.service.js';
import { ItensController } from './itens.controller.js';

@Module({
  controllers: [ItensController],
  providers: [ItensService],
})
export class ItensModule {}
