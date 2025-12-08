import { prisma } from '@/lib/db';
import type { User } from '@/lib/types';

// Получение всех пользователей
export async function getUsers() {
  return prisma.user.findMany({
    orderBy: {
      username: 'asc',
    },
  });
}

// Создание нового пользователя
export async function createUser(data: Omit<User, 'id' | 'createdAt'>) {
  return prisma.user.create({
    data: {
      ...data,
      createdAt: new Date().toISOString(),
    },
  });
}

// Обновление пользователя
export async function updateUser(id: string, data: Partial<User>) {
  return prisma.user.update({
    where: { id },
    data: {
      ...data,
      createdAt: undefined, // Исключаем из обновления
    },
  });
}

// Удаление пользователя
export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}

// Получение пользователя по ID
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

// Получение пользователя по имени
export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

// Аутентификация пользователя
export async function authenticateUser(username: string): Promise<User | null> {
  const user = await getUserByUsername(username);
  if (user) {
    return {
      id: user.id,
      username: user.username,
      role: user.role as "admin" | "user",
    };
  }
  return null;
}