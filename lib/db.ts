import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  // В Prisma 7 URL базы данных читается автоматически из переменных окружения
  // или из prisma.config.ts, поэтому не нужно передавать datasources
  // PrismaClient автоматически использует DATABASE_URL из process.env
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;