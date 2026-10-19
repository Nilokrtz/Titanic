import 'dotenv/config';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly cliente = process.env.REDIS_URL
    ? createClient({
        url: process.env.REDIS_URL,
        socket: { reconnectStrategy: false },
      })
    : null;

  constructor() {
    this.cliente?.on('error', (erro) => {
      this.logger.warn(`Redis indisponível: ${erro.message}`);
    });
  }

  async onModuleInit(): Promise<void> {
    if (!this.cliente) return;

    try {
      await this.cliente.connect();
    } catch {
      this.logger.warn('A API continuará consultando o banco sem cache.');
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.cliente?.isOpen) await this.cliente.quit();
  }

  async buscar<T>(chave: string): Promise<T | null> {
    if (!this.cliente?.isReady) return null;

    try {
      const valor = await this.cliente.get(chave);
      return valor ? (JSON.parse(valor) as T) : null;
    } catch {
      return null;
    }
  }

  async salvar(chave: string, valor: unknown): Promise<void> {
    if (!this.cliente?.isReady) return;

    try {
      await this.cliente.setEx(chave, 30, JSON.stringify(valor));
    } catch {
      this.logger.warn('Não foi possível guardar os dados no Redis.');
    }
  }

  async consultar<T>(chave: string, buscarNoBanco: () => Promise<T>): Promise<T> {
    const valorSalvo = await this.buscar<T>(chave);
    if (valorSalvo !== null) return valorSalvo;

    const valor = await buscarNoBanco();
    await this.salvar(chave, valor);
    return valor;
  }

  async limpar(prefixo: string): Promise<void> {
    if (!this.cliente?.isReady) return;

    try {
      for await (const chaves of this.cliente.scanIterator({ MATCH: `${prefixo}*` })) {
        if (chaves.length) await this.cliente.del(chaves);
      }
    } catch {
      this.logger.warn('Não foi possível limpar o cache no Redis.');
    }
  }
}
