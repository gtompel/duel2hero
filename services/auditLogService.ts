import { prisma } from '@/lib/db';
import type { AuditLog } from '@/lib/types';

// Создание новой записи аудита
export async function createAuditLog(data: Omit<AuditLog, 'id' | 'createdAt'>) {
  return prisma.auditLog.create({
    data: {
      ...data,
      createdAt: new Date().toISOString(),
    },
  });
}

// Получение записей аудита с фильтрацией
export async function getAuditLogs(filters: {
  entity?: string;
  entityId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}) {
  const { page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  // Построение условий фильтрации
  const where: any = {};

  if (filters.entity) {
    where.entity = filters.entity;
  }

  if (filters.entityId) {
    where.entityId = filters.entityId;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Получение записи аудита по ID
export async function getAuditLogById(id: string) {
  return prisma.auditLog.findUnique({
    where: { id },
  });
}

// Логирование действий пользователя
export async function logUserAction(
  userId: string,
  action: "CREATE" | "UPDATE" | "DELETE",
  entity: string,
  entityId: string,
  details?: string
) {
  return createAuditLog({
    action,
    entity,
    entityId,
    userId,
    details,
  });
}