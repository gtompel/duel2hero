export interface NumberRecord {
  value: number; // Значение числа
  date: string; // Дата и время получения в формате ISO строки
}

export interface Results {
  timeSpent: number; // Время выполнения в миллисекундах
  numbersGenerated: NumberRecord[]; // Массив сгенерированных чисел с метками времени
}

export interface QueueState {
  queue: number[]; // Текущая очередь чисел
  collectedNumbers: Map<number, string>; // Собранные уникальные числа и их метки времени
  running: boolean; // Статус работы системы
  startTime: number | null; // Время начала сбора
  endTime: number | null; // Время окончания сбора
  producerCount: number; // Количество производителей
  minNumber: number; // Минимальное значение диапазона
  maxNumber: number; // Максимальное значение диапазона
  completionPercentage: number; // Процент завершения сбора
}