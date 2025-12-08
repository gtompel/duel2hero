import { prisma } from '@/lib/db';
import type { Level } from '@/lib/types';

// Получение всех уровней
export async function getLevels() {
  return prisma.level.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

// Создание нового уровня
export async function createLevel(data: Omit<Level, 'id' | 'createdAt'>) {
  return prisma.level.create({
    data,
  });
}

// Обновление уровня
export async function updateLevel(id: string, data: Partial<Level>) {
  return prisma.level.update({
    where: { id },
    data: {
      ...data,
      createdAt: undefined, // Исключаем из обновления
    },
  });
}

// Удаление уровня
export async function deleteLevel(id: string) {
  return prisma.level.delete({
    where: { id },
  });
}

// Получение уровня по ID
export async function getLevelById(id: string) {
  return prisma.level.findUnique({
    where: { id },
  });
}

// Получение уровня по коду
export async function getLevelByCode(code: string) {
  return prisma.level.findUnique({
    where: { code },
  });
}