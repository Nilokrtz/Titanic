import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Counter } from 'prom-client';
import type { NextFunction, Request, Response } from 'express';

const requisicoesHttp = new Counter({
  name: 'http_requests_total',
  help: 'Total de requisicoes HTTP por rota e status',
  labelNames: ['method', 'route', 'status_code'],
});

const rotasMonitoradas = [
  'GET /',
  'GET /personagens/:id',
  'POST /auth/login',
  'POST /auth/registrar',
  'POST /personagens',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((requisicao: Request, resposta: Response, proximo: NextFunction) => {
    resposta.on('finish', () => {
      const rota = requisicao.route?.path;

      if (rota && rotasMonitoradas.includes(`${requisicao.method} ${rota}`)) {
        requisicoesHttp.inc({
          method: requisicao.method,
          route: rota,
          status_code: resposta.statusCode,
        });
      }
    });

    proximo();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Http Quest: Em busca do 200 OK')
    .setDescription('API de Backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
