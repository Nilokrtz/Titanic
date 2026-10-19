import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventosProducerService } from './eventos_producer.service.js';
import { EventosController } from './eventos.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Global()
@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672'],
          queue: 'send_email_eventos_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [EventosController],
  providers: [EventosProducerService],
  exports: [EventosProducerService, ClientsModule],
})
export class EventosModule {}
