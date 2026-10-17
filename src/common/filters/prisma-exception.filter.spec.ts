import { Logger } from '@nestjs/common';
import type { ArgumentsHost, HttpServer } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaExceptionFilter } from './prisma-exception.filter.js';

describe('PrismaExceptionFilter', () => {
  const resposta = {};
  const enviarResposta = vi.fn();
  const adaptador = {
    isHeadersSent: () => false,
    reply: enviarResposta,
  } as unknown as HttpServer;
  const contexto = {
    getArgByIndex: () => resposta,
  } as unknown as ArgumentsHost;
  const filtro = new PrismaExceptionFilter(adaptador);

  beforeEach(() => enviarResposta.mockReset());

  it('responde 409 no formato padrão do Nest para valor duplicado', () => {
    const erro = new Prisma.PrismaClientKnownRequestError('Valor duplicado', {
      code: 'P2002',
      clientVersion: '7.10.0',
    });

    filtro.catch(erro, contexto);

    expect(enviarResposta).toHaveBeenCalledWith(
      resposta,
      expect.objectContaining({
        statusCode: 409,
        message: 'Registro já cadastrado.',
      }),
      409,
    );
  });

  it('mantém o tratamento padrão para outro erro do Prisma', () => {
    const registrarErro = vi
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    const erro = new Prisma.PrismaClientKnownRequestError('Relação inválida', {
      code: 'P2003',
      clientVersion: '7.10.0',
    });

    filtro.catch(erro, contexto);

    expect(enviarResposta).toHaveBeenCalledWith(
      resposta,
      { statusCode: 500, message: 'Internal server error' },
      500,
    );
    registrarErro.mockRestore();
  });
});
