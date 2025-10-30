import { z } from "zod"

// Валидация даты (три отдельных поля)
const datePartsSchema = z
  .object({
    day: z.number().min(1, "День должен быть от 1 до 31").max(31, "День должен быть от 1 до 31"),
    month: z.number().min(1, "Месяц должен быть от 1 до 12").max(12, "Месяц должен быть от 1 до 12"),
    year: z.number().min(1900, "Год должен быть больше 1900").max(2100, "Год должен быть меньше 2100"),
  })
  .refine(
    (data) => {
      // Проверка валидности даты
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

      // Проверка високосного года
      const isLeapYear = (data.year % 4 === 0 && data.year % 100 !== 0) || data.year % 400 === 0
      if (isLeapYear) daysInMonth[1] = 29

      return data.day <= daysInMonth[data.month - 1]
    },
    {
      message: "Недопустимая дата",
      path: ["day"],
    },
  )

// Основная схема протокола
export const protocolSchema = z
  .object({
    testType: z.string().min(1, "Выберите вид испытания"),
    dateDay: z.number().min(1).max(31),
    dateMonth: z.number().min(1).max(12),
    dateYear: z.number().min(1900).max(2100),
    resultValue: z.number({
      required_error: "Введите результат",
      invalid_type_error: "Результат должен быть числом",
    }),
    level: z.enum(["bronze", "silver", "gold"], {
      required_error: "Выберите уровень выполнения",
    }),
    sportTitle: z.string().optional(),
    sportTitleFrom: z.string().optional(),
    sportTitleTo: z.string().optional(),
  })
  .refine(
    (data) => {
      // Проверка валидности даты
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      const isLeapYear = (data.dateYear % 4 === 0 && data.dateYear % 100 !== 0) || data.dateYear % 400 === 0
      if (isLeapYear) daysInMonth[1] = 29

      return data.dateDay <= daysInMonth[data.dateMonth - 1]
    },
    {
      message: "Недопустимая дата",
      path: ["dateDay"],
    },
  )
  .refine(
    (data) => {
      // Если указано спортивное звание, даты обязательны
      if (data.sportTitle && data.sportTitle.length > 0) {
        return data.sportTitleFrom && data.sportTitleTo
      }
      return true
    },
    {
      message: "Если указано спортивное звание, укажите срок действия",
      path: ["sportTitleFrom"],
    },
  )
  .refine(
    (data) => {
      // Проверка: дата начала <= дата окончания
      if (data.sportTitleFrom && data.sportTitleTo) {
        return new Date(data.sportTitleFrom) <= new Date(data.sportTitleTo)
      }
      return true
    },
    {
      message: "Дата начала должна быть раньше даты окончания",
      path: ["sportTitleTo"],
    },
  )

// Схемы для справочников
export const testTypeSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  description: z.string().min(5, "Описание должно содержать минимум 5 символов"),
})

export const levelSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  code: z.enum(["bronze", "silver", "gold"]),
})

export const sportTitleSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
})

export const textToNumberMappingSchema = z.object({
  textValue: z.string().min(1, "Введите текстовое значение"),
  numberValue: z.number({
    required_error: "Введите числовое значение",
    invalid_type_error: "Значение должно быть числом",
  }),
  testType: z.string().min(1, "Выберите вид испытания"),
})

// Типы для TypeScript
export type ProtocolFormData = z.infer<typeof protocolSchema>
export type TestTypeFormData = z.infer<typeof testTypeSchema>
export type LevelFormData = z.infer<typeof levelSchema>
export type SportTitleFormData = z.infer<typeof sportTitleSchema>
export type TextToNumberMappingFormData = z.infer<typeof textToNumberMappingSchema>
