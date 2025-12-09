// Основная модель протокола согласно спецификации
export interface Protocol {
  id: string
  testType: string // Вид испытания
  dateDay: number // День (1-31)
  dateMonth: number // Месяц (1-12)
  dateYear: number // Год
  resultValue: number // Результат (числовое значение)
  level: string // Уровень выполнения (bronze, silver, gold)
  sportTitle?: string // Спортивное звание (опционально)
  sportTitleFrom?: string // Дата начала действия звания
  sportTitleTo?: string // Дата окончания действия звания
  imageUrl?: string // Ссылка на изображение протокола (опционально)
  createdAt: string
  updatedAt: string
}

// Справочные данные
export interface TestType {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface Level {
  id: string
  name: string
  code: string // bronze, silver, gold
  createdAt: string
}

export interface SportTitle {
  id: string
  name: string
  createdAt: string
}

// Маппинг текст → число для результатов
export interface TextToNumberMapping {
  id: string
  textValue: string
  numberValue: number
  testType: string
  createdAt: string
}

// Лог действий для безопасности
export interface AuditLog {
  id: string
  action: "CREATE" | "UPDATE" | "DELETE"
  entity: string
  entityId: string
  userId: string
  details?: string
  createdAt: string
}

// User type для аутентификации
export interface User {
  id: string
  username: string
  role: "admin" | "user"
}

// Фильтры для API
export interface ProtocolFilters {
  testType?: string
  level?: string
  dateFrom?: { day: number; month: number; year: number }
  dateTo?: { day: number; month: number; year: number }
  page?: number
  limit?: number
}
