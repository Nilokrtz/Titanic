import 'dotenv/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AutenticacaoGuard } from './guards/autenticacao.guard.js';
import { SenhasService } from './senhas.service.js';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const segredo = process.env.JWT_SECRET;

        if (!segredo) {
          throw new Error('JWT_SECRET não configurada.');
        }

        return {
          secret: segredo,
          signOptions: { expiresIn: '15m', algorithm: 'HS256' },
          verifyOptions: { algorithms: ['HS256'] },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SenhasService, AutenticacaoGuard],
  exports: [AutenticacaoGuard],
})
export class AuthModule {}
