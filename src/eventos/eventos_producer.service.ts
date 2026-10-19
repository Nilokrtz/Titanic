import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EventosProducerService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  async publicarUsuarioRegistado(payload: {
    usuarioId: number;
    email: string;
    criadoEm: Date;
  }) {
    this.rabbitClient.emit('usuario_registado', payload);
  }
}