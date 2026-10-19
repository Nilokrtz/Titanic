import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async enviarBoasVindas(email: string): Promise<void> {
    const usuario = process.env.SMTP_USER;
    const senha = process.env.SMTP_APP_PASSWORD;

    if (!usuario || !senha) {
      throw new Error('SMTP_USER e SMTP_APP_PASSWORD não configurados.');
    }

    const transporte = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: usuario, pass: senha },
    });

    await transporte.sendMail({
      from: usuario,
      to: email,
      subject: 'Bem-vindo ao HTTP Quest',
      text: 'Seu cadastro no HTTP Quest foi realizado. Bons desafios!',
    });
  }
}
