# GTO Protocol Management System

Приложение для ведения протоколов сдачи норм ГТО (Готов к труду и обороне).

## Технологии

- **Next.js 16** (App Router, TypeScript)
- **React Hook Form** + **Zod** для валидации форм
- **Prisma** для работы с базой данных (схема готова)
- **Tailwind CSS** для стилизации
- **shadcn/ui** для UI компонентов

## Требования

- Node.js 18+
- npm или yarn
- PostgreSQL (опционально, для production)

## Установка и запуск

### 1. Установка зависимостей

```bash
npm install
# или
yarn install
```

### 2. Настройка базы данных (опционально)

Для работы с реальной БД создайте файл `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gto_db"
```

Затем выполните миграции:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Запуск в режиме разработки

```bash
npm run dev
# или
yarn dev
```

Приложение будет доступно по адресу: [http://localhost:3000](http://localhost:3000)

## Структура проекта

```text
├── app/
│   ├── api/
│   │   └── protocols/          # REST API endpoints
│   ├── admin/                  # Админ-панель
│   ├── login/                  # Страница входа
│   └── page.tsx                # Главная страница
├── components/
│   ├── auth/                   # Компоненты аутентификации
│   ├── admin/                  # Компоненты админ-панели
│   ├── protocol-form.tsx       # Форма протокола
│   ├── protocols-list.tsx      # Список протоколов
│   └── protocols-filter.tsx    # Фильтры
├── lib/
│   ├── types.ts                # TypeScript типы
│   ├── validation.ts           # Zod схемы валидации
│   ├── storage.ts              # Работа с данными
│   └── csv-export.ts           # Экспорт в CSV
└── prisma/
    └── schema.prisma           # Prisma схема БД
```

## Основные функции

### 1. Форма протокола

Форма включает следующие поля:

- **Вид испытания** (обязательно, select)
- **Дата выполнения** (обязательно, три select: день/месяц/год)
- **Результат выполнения** (обязательно, числовое значение)
- **Уровень выполнения** (обязательно, select: bronze/silver/gold)
- **Спортивное звание** (опционально)
- **Срок действия звания** (обязательно, если указано звание)

### 2. Валидация

- **Фронтенд**: React Hook Form + Zod
- **Бэкенд**: Zod валидация в API routes
- Проверка корректности дат (високосные годы, количество дней в месяце)
- Проверка: если указано спортивное звание, даты обязательны
- Проверка: дата начала ≤ дата окончания

### 3. CRUD операции

REST API endpoints:

- `GET /api/protocols` — список протоколов (с фильтрацией и пагинацией)
- `GET /api/protocols/[id]` — один протокол
- `POST /api/protocols` — создать протокол
- `PUT /api/protocols/[id]` — обновить протокол
- `DELETE /api/protocols/[id]` — удалить протокол

### 4. Фильтрация и пагинация

Параметры запроса:

- `testType` — фильтр по виду испытания
- `level` — фильтр по уровню
- `dateFromDay`, `dateFromMonth`, `dateFromYear` — дата от
- `dateToDay`, `dateToMonth`, `dateToYear` — дата до
- `page` — номер страницы
- `limit` — количество записей на странице

### 5. Экспорт в CSV

Экспорт всех протоколов или отфильтрованных данных в CSV файл.

### 6. Админ-панель

Управление справочниками:

- Виды испытаний
- Уровни выполнения
- Спортивные звания
- Маппинг текст → число (для преобразования текстовых результатов)

### 7. Безопасность

- Авторизация для изменения данных
- Санитизация входных данных (trim)
- Логирование всех действий (audit log)
- Проверка прав доступа в API routes

## Аутентификация

Демо-пользователи:

- **admin** — администратор (полный доступ)
- **user** — пользователь (только просмотр)

## Модель данных

### Protocol

```prisma
model Protocol {
  id              String    @id @default(cuid())
  testType        String    // Вид испытания
  dateDay         Int       // День (1-31)
  dateMonth       Int       // Месяц (1-12)
  dateYear        Int       // Год
  resultValue     Float     // Результат (число)
  level           String    // Уровень (bronze/silver/gold)
  sportTitle      String?   // Спортивное звание
  sportTitleFrom  DateTime? // Дата начала
  sportTitleTo    DateTime? // Дата окончания
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

## Примеры использования API

### Создание протокола

```bash
curl -X POST http://localhost:3000/api/protocols \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "Бег 100м",
    "dateDay": 15,
    "dateMonth": 3,
    "dateYear": 2024,
    "resultValue": 12.5,
    "level": "gold",
    "sportTitle": "Мастер спорта",
    "sportTitleFrom": "2023-01-01",
    "sportTitleTo": "2027-01-01"
  }'
```

### Получение списка с фильтрами

```bash
curl "http://localhost:3000/api/protocols?testType=Бег%20100м&level=gold&page=1&limit=10"
```

## Разработка

### Добавление новых полей

1. Обновите Prisma схему в `prisma/schema.prisma`
2. Выполните миграцию: `npx prisma migrate dev`
3. Обновите TypeScript типы в `lib/types.ts`
4. Обновите Zod схемы в `lib/validation.ts`
5. Обновите компоненты форм

### Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e
```

## Production

Для production рекомендуется:

1. Использовать PostgreSQL вместо localStorage
2. Добавить настоящую систему аутентификации (NextAuth.js)
3. Настроить CORS и rate limiting
4. Добавить мониторинг и логирование
5. Настроить CI/CD

## Лицензия

MIT
