import { PrismaClient, Prisma } from '@prisma/client';

const prismaClientSingleton = () => {
  // Проверяем наличие DATABASE_URL
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // В Prisma 7 PrismaClient читает DATABASE_URL из process.env автоматически
  // Используем правильную типизацию для конфигурации
  const clientConfig: Prisma.PrismaClientOptions = {};
  
  // Добавляем log только в development
  if (process.env.NODE_ENV === 'development') {
    clientConfig.log = ['error', 'warn'];
  }

  return new PrismaClient(clientConfig);
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;