import { ArgumentsHost, Catch, ConflictException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../../generated/prisma/client.js';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(erro: Prisma.PrismaClientKnownRequestError, contexto: ArgumentsHost) {
    if (erro.code === 'P2002') {
      super.catch(new ConflictException('Registro já cadastrado.'), contexto);
      return;
    }

    super.catch(erro, contexto);
  }
}
