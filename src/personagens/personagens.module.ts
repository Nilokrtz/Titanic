import { Module } from '@nestjs/common';
import { PersonagensService } from './personagens.service.js';
import { PersonagensController } from './personagens.controller.js';

@Module({
  controllers: [PersonagensController],
  providers: [PersonagensService],
})
export class PersonagensModule {}
