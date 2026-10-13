import 'dotenv/config';
import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const urlBanco = process.env.DATABASE_URL;

    if (!urlBanco) {
      throw new Error('DATABASE_URL não configurada.');
    }

    super({ adapter: new PrismaPg({ connectionString: urlBanco }) });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
