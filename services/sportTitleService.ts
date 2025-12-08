import { prisma } from '@/lib/db';
import type { SportTitle } from '@/lib/types';

// Получение всех спортивных званий
export async function getSportTitles() {
  return prisma.sportTitle.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

// Создание нового спортивного звания
export async function createSportTitle(data: Omit<SportTitle, 'id' | 'createdAt'>) {
  return prisma.sportTitle.create({
    data,
  });
}

// Обновление спортивного звания
export async function updateSportTitle(id: string, data: Partial<SportTitle>) {
  return prisma.sportTitle.update({
    where: { id },
    data: {
      ...data,
      createdAt: undefined, // Исключаем из обновления
    },
  });
}

// Удаление спортивного звания
export async function deleteSportTitle(id: string) {
  return prisma.sportTitle.delete({
    where: { id },
  });
}

// Получение спортивного звания по ID
export async function getSportTitleById(id: string) {
  return prisma.sportTitle.findUnique({
    where: { id },
  });
}

// Получение спортивного звания по имени
export async function getSportTitleByName(name: string) {
  return prisma.sportTitle.findUnique({
    where: { name },
  });
}