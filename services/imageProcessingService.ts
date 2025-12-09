import { createWorker } from 'tesseract.js';

// Функция для извлечения текста из изображения с помощью Tesseract.js
export async function extractTextFromImage(imageUrl: string): Promise<string> {
  try {
    // Создаем воркер для Tesseract.js
    const worker = await createWorker('rus+eng');
    
    // Загружаем изображение и извлекаем текст
    const ret = await worker.recognize(imageUrl);
    const text = ret.data.text;
    
    // Освобождаем ресурсы
    await worker.terminate();
    
    return text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error('Failed to extract text from image');
  }
}

// Функция для парсинга текста протокола и извлечения данных
export function parseProtocolText(text: string): Partial<ProtocolData> {
  // Приводим текст к нижнему регистру для более простого поиска
  const lowerText = text.toLowerCase();
  
  // Инициализируем объект для хранения извлеченных данных
  const data: Partial<ProtocolData> = {};
  
  // Попытка извлечь вид испытания
  const testTypeMatch = lowerText.match(/(бег|подтягивание|отжимание|прыжок)/i);
  if (testTypeMatch) {
    data.testType = capitalizeFirstLetter(testTypeMatch[1]);
  }
  
  // Попытка извлечь дату (в формате дд.мм.гггг или дд/мм/гггг)
  const dateMatch = text.match(/(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  if (dateMatch) {
    data.dateDay = parseInt(dateMatch[1]);
    data.dateMonth = parseInt(dateMatch[2]);
    data.dateYear = parseInt(dateMatch[3]);
  }
  
  // Попытка извлечь результат (число с плавающей точкой)
  const resultMatch = text.match(/(\d+([.,]\d+)?)/);
  if (resultMatch) {
    data.resultValue = parseFloat(resultMatch[1].replace(',', '.'));
  }
  
  // Попытка извлечь уровень выполнения
  if (lowerText.includes('золото') || lowerText.includes('золотой')) {
    data.level = 'gold';
  } else if (lowerText.includes('серебро') || lowerText.includes('серебряный')) {
    data.level = 'silver';
  } else if (lowerText.includes('бронза') || lowerText.includes('бронзовый')) {
    data.level = 'bronze';
  }
  
  return data;
}

// Вспомогательная функция для приведения первой буквы к заглавной
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Тип для данных протокола
interface ProtocolData {
  testType?: string;
  dateDay?: number;
  dateMonth?: number;
  dateYear?: number;
  resultValue?: number;
  level?: string;
  sportTitle?: string;
  sportTitleFrom?: string;
  sportTitleTo?: string;
}