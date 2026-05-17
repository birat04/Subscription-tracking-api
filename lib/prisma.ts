import 'server-only';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const connectionUrl = process.env.DB_URI;
const isAccelerateUrl =
  connectionUrl?.startsWith('prisma://') || connectionUrl?.startsWith('prisma+postgres://');

const prismaLog: Prisma.LogLevel[] = process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'];

const createPrismaClient = () => {
  if (!connectionUrl) {
    return new PrismaClient({ log: prismaLog });
  }

  if (isAccelerateUrl) {
    return new PrismaClient({
      log: prismaLog,
      accelerateUrl: connectionUrl,
    });
  }

  const adapter = new PrismaPg({ connectionString: connectionUrl });
  return new PrismaClient({
    log: prismaLog,
    adapter,
  });
};

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
