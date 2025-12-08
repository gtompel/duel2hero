import { prisma } from '@/lib/db';
import type { TestType } from '@/lib/types';

// Получение всех типов испытаний
export async function getTestTypes() {
  return prisma.testType.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

// Создание нового типа испытания
export async function createTestType(data: Omit<TestType, 'id' | 'createdAt'>) {
  return prisma.testType.create({
    data,
  });
}

// Обновление типа испытания
export async function updateTestType(id: string, data: Partial<TestType>) {
  return prisma.testType.update({
    where: { id },
    data: {
      ...data,
      createdAt: undefined, // Исключаем из обновления
    },
  });
}

// Удаление типа испытания
export async function deleteTestType(id: string) {
  return prisma.testType.delete({
    where: { id },
  });
}

// Получение типа испытания по ID
export async function getTestTypeById(id: string) {
  return prisma.testType.findUnique({
    where: { id },
  });
}

// Получение типа испытания по имени
export async function getTestTypeByName(name: string) {
  return prisma.testType.findUnique({
    where: { name },
  });
}