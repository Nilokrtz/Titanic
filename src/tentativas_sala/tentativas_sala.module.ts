import { Module } from '@nestjs/common';
import { TentativasSalaService } from './tentativas_sala.service.js';
import { TentativasSalaController } from './tentativas_sala.controller.js';

@Module({
  controllers: [TentativasSalaController],
  providers: [TentativasSalaService],
})
export class TentativasSalaModule {}
