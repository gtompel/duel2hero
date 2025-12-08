import { prisma } from '@/lib/db';
import type { Protocol } from '@/lib/types';

// Получение списка протоколов с фильтрацией
export async function getProtocols(filters: {
  testType?: string;
  level?: string;
  dateFrom?: { day: number; month: number; year: number };
  dateTo?: { day: number; month: number; year: number };
  page?: number;
  limit?: number;
}) {
  const { page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  // Построение условий фильтрации
  const where: any = {};

  if (filters.testType) {
    where.testType = filters.testType;
  }

  if (filters.level) {
    where.level = filters.level;
  }

  if (filters.dateFrom) {
    where.dateYear = {
      gte: filters.dateFrom.year,
    };
    
    // Добавляем дополнительные условия для точной фильтрации дат
    if (filters.dateFrom.month) {
      where.dateMonth = {
        gte: filters.dateFrom.month,
      };
    }
    
    if (filters.dateFrom.day) {
      where.dateDay = {
        gte: filters.dateFrom.day,
      };
    }
  }

  if (filters.dateTo) {
    where.dateYear = {
      ...where.dateYear,
      lte: filters.dateTo.year,
    };
    
    // Добавляем дополнительные условия для точной фильтрации дат
    if (filters.dateTo.month) {
      where.dateMonth = {
        ...where.dateMonth,
        lte: filters.dateTo.month,
      };
    }
    
    if (filters.dateTo.day) {
      where.dateDay = {
        ...where.dateDay,
        lte: filters.dateTo.day,
      };
    }
  }

  const [protocols, total] = await Promise.all([
    prisma.protocol.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.protocol.count({ where }),
  ]);

  return {
    data: protocols,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Создание нового протокола
export async function createProtocol(data: Omit<Protocol, 'id' | 'createdAt' | 'updatedAt'>) {
  return prisma.protocol.create({
    data: {
      ...data,
      sportTitleFrom: data.sportTitleFrom ? new Date(data.sportTitleFrom) : undefined,
      sportTitleTo: data.sportTitleTo ? new Date(data.sportTitleTo) : undefined,
    },
  });
}

// Получение протокола по ID
export async function getProtocolById(id: string) {
  return prisma.protocol.findUnique({
    where: { id },
  });
}

// Обновление протокола
export async function updateProtocol(id: string, data: Partial<Protocol>) {
  return prisma.protocol.update({
    where: { id },
    data: {
      ...data,
      sportTitleFrom: data.sportTitleFrom ? new Date(data.sportTitleFrom) : undefined,
      sportTitleTo: data.sportTitleTo ? new Date(data.sportTitleTo) : undefined,
      updatedAt: new Date(),
    },
  });
}

// Удаление протокола
export async function deleteProtocol(id: string) {
  return prisma.protocol.delete({
    where: { id },
  });
}