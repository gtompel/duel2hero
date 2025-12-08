import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
 
// @ts-expect-error - @types/pg может быть не установлен, но pg работает
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const clientConfig: Prisma.PrismaClientOptions = {};
  
  // В Prisma 7:
  // - Для Accelerate URL (prisma:// или prisma+postgres://) используем accelerateUrl
  // - Для прямого PostgreSQL URL используем адаптер
  if (databaseUrl.startsWith('prisma+') || databaseUrl.startsWith('prisma://')) {
    // Prisma Accelerate
    clientConfig.accelerateUrl = databaseUrl;
  } else {
    // Прямое подключение PostgreSQL через адаптер
    const pool = new Pool({ connectionString: databaseUrl });
    clientConfig.adapter = new PrismaPg(pool);
  }
  
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