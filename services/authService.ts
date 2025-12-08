import { prisma } from '@/lib/db';
import type { User } from '@/lib/types';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

// Хэширование пароля
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Проверка пароля
async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Аутентификация пользователя
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || !user.password) {
    return null;
  }

  // Проверяем пароль
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role as "admin" | "user",
  };
}

// Создание нового пользователя
export async function createUser(username: string, password: string, role: "admin" | "user"): Promise<User> {
  // Хэшируем пароль перед сохранением
  const hashedPassword = await hashPassword(password);
  
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role,
    },
  });

  return {
    id: user.id,
    username: user.username,
    role: user.role as "admin" | "user",
  };
}

// Получение пользователя по ID
export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (user) {
    return {
      id: user.id,
      username: user.username,
      role: user.role as "admin" | "user",
    };
  }

  return null;
}

// Получение пользователя по имени
export async function getUserByUsername(username: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user) {
    return {
      id: user.id,
      username: user.username,
      role: user.role as "admin" | "user",
    };
  }

  return null;
}

// Проверка существования пользователя
export async function userExists(username: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  
  return !!user;
}

// Создание токена сброса пароля
export async function createPasswordResetToken(userId: string): Promise<string> {
  // Генерируем криптографически стойкий токен
  const token = randomBytes(32).toString('hex');
  
  // Токен действителен 1 час
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

// Получение токена сброса пароля
export async function getPasswordResetToken(token: string) {
  return prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });
}

// Обновление пароля пользователя
export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
  const hashedPassword = await hashPassword(newPassword);
  
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

// Помечаем токен сброса пароля как использованный
export async function markTokenAsUsed(token: string): Promise<void> {
  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });
}

// Удаление просроченных токенов
export async function deleteExpiredTokens(): Promise<void> {
  await prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}