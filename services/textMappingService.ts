import { prisma } from '@/lib/db';
import type { TextToNumberMapping } from '@/lib/types';

// Получение всех текстовых маппингов
export async function getTextMappings() {
  return prisma.textToNumberMapping.findMany({
    orderBy: {
      testType: 'asc',
      textValue: 'asc',
    },
  });
}

// Создание нового текстового маппинга
export async function createTextMapping(data: Omit<TextToNumberMapping, 'id' | 'createdAt'>) {
  return prisma.textToNumberMapping.create({
    data,
  });
}

// Обновление текстового маппинга
export async function updateTextMapping(id: string, data: Partial<TextToNumberMapping>) {
  return prisma.textToNumberMapping.update({
    where: { id },
    data: {
      ...data,
      createdAt: undefined, // Исключаем из обновления
    },
  });
}

// Удаление текстового маппинга
export async function deleteTextMapping(id: string) {
  return prisma.textToNumberMapping.delete({
    where: { id },
  });
}

// Получение текстового маппинга по ID
export async function getTextMappingById(id: string) {
  return prisma.textToNumberMapping.findUnique({
    where: { id },
  });
}

// Получение текстового маппинга по текстовому значению и типу испытания
export async function getTextMappingByTextAndTestType(textValue: string, testType: string) {
  return prisma.textToNumberMapping.findUnique({
    where: { 
      textValue_testType: {
        textValue,
        testType,
      },
    },
  });
}

// Преобразование текста в число
export async function convertTextToNumber(textValue: string, testType: string): Promise<number | null> {
  const mapping = await getTextMappingByTextAndTestType(textValue, testType);
  return mapping ? mapping.numberValue : null;
}