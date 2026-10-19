import 'dotenv/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthRepository } from './auth.repository.js';
import { AutenticacaoGuard } from './guards/autenticacao.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { SenhasService } from './senhas.service.js';
import { EmailService } from './email.service.js';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const segredo = process.env.JWT_SECRET;
        const segredoRefresh = process.env.JWT_REFRESH_SECRET;

        if (!segredo) {
          throw new Error('JWT_SECRET não configurada.');
        }

        if (!segredoRefresh || segredoRefresh === segredo) {
          throw new Error(
            'JWT_REFRESH_SECRET deve ser configurada com outra chave.',
          );
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
  providers: [
    AuthService,
    AuthRepository,
    SenhasService,
    EmailService,
    AutenticacaoGuard,
    RolesGuard,
  ],
  exports: [AutenticacaoGuard, RolesGuard, SenhasService, JwtModule, AuthRepository],
})
export class AuthModule {}
