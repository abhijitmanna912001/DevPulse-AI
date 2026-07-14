import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import { env } from '../config/env.js';

function createPrismaClient() {
  const adapter = new PrismaPg(env.DATABASE_URL);

  return new PrismaClient({
    adapter,
  });
}

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  env.NODE_ENV === 'production'
    ? createPrismaClient()
    : (globalForPrisma.prisma ??= createPrismaClient());
