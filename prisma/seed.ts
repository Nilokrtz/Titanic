import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const urlBanco = process.env.DATABASE_URL;

if (!urlBanco) {
  throw new Error('DATABASE_URL não configurada.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: urlBanco }),
});

try {
  await prisma.perfis.upsert({
    where: { nome: 'ALUNO' },
    update: {},
    create: { nome: 'ALUNO' },
  });
} finally {
  await prisma.$disconnect();
}
