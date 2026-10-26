import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from '../auth/email.service.js';

@Controller()
export class EventosController {
  private readonly logger = new Logger(EventosController.name);

  constructor(private readonly emailService: EmailService) {}

  @EventPattern('usuario_registado') 
  async processarBoasVindas(@Payload() data: { usuarioId: number; email: string }) {
    this.logger.log(`Evento recebido`);

    try {
      await this.emailService.enviarBoasVindas(data.email);
    } catch (erro) {
      this.logger.error(`Erro ao enviar e-mail: ${erro}`);
    }
  }
}