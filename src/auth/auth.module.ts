import { Module } from '@nestjs/common';
import { SenhasService } from './senhas.service.js';

@Module({
  providers: [SenhasService],
})
export class AuthModule {}
