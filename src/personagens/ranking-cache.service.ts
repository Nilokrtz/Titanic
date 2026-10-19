import 'dotenv/config';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';
import { RankingXpRespostaDto } from './dto/ranking-xp-resposta.dto.js';

@Injectable()
export class RankingCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RankingCacheService.name);
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
      this.logger.warn('Ranking funcionando sem cache.');
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.cliente?.isOpen) await this.cliente.quit();
  }

  async buscar(chave: string): Promise<RankingXpRespostaDto | null> {
    if (!this.cliente?.isReady) return null;

    try {
      const ranking = await this.cliente.get(chave);
      return ranking ? (JSON.parse(ranking) as RankingXpRespostaDto) : null;
    } catch {
      return null;
    }
  }

  async salvar(chave: string, ranking: RankingXpRespostaDto): Promise<void> {
    if (!this.cliente?.isReady) return;

    try {
      await this.cliente.setEx(chave, 30, JSON.stringify(ranking));
    } catch {
      this.logger.warn('Não foi possível guardar o ranking no Redis.');
    }
  }
}
