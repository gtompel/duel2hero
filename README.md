# GTO Protocol Management System

Приложение для ведения протоколов сдачи норм ГТО (Готов к труду и обороне) — российской системы физкультурных нормативов.

## Описание проекта

Это MVP приложение предназначено для:

- Ведения электронных протоколов выполнения нормативов ГТО
- Управления справочниками видов испытаний, уровней выполнения и спортивных званий
- Преобразования текстовых результатов в числовые значения через настраиваемый маппинг
- Фильтрации и экспорта данных в CSV формат
- Обеспечения безопасности через систему авторизации и audit logging

## Технологический стек

- **Next.js 16** (App Router, TypeScript, React 19)
- **React Hook Form** + **Zod** для валидации форм на фронтенде и бэкенде
- **Prisma ORM** для работы с базой данных
- **Tailwind CSS v4** для стилизации
- **shadcn/ui** для UI компонентов
- **PostgreSQL** (рекомендуется для production)
- **localStorage** (fallback для демо без БД)

## Системные требования

- Node.js 18.17 или выше
- npm 9+ или yarn 1.22+
- PostgreSQL 14+ (опционально, для production)

## Быстрый старт

### 1. Клонирование и установка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd gto-protocol-app

# Установите зависимости
npm install
# или
yarn install
```

### 2. Настройка окружения

Создайте файл `.env` в корне проекта:

```env
# База данных (опционально для демо)
DATABASE_URL="postgresql://user:password@localhost:5432/gto_db"

# Секрет для сессий (в production используйте криптостойкий ключ)
SESSION_SECRET="your-secret-key-here"

# Режим работы
NODE_ENV="development"
```

### 3. Настройка базы данных

#### Вариант A: С PostgreSQL (рекомендуется)

```bash
# Создайте базу данных
createdb gto_db

# Выполните миграции
npx prisma migrate dev --name init

# Сгенерируйте Prisma Client
npx prisma generate

# Заполните базу тестовыми данными
npx prisma db seed
```

#### Вариант B: Без БД (демо режим)

Приложение автоматически использует `localStorage` для хранения данных. Просто запустите dev сервер.

### 4. Запуск приложения

```bash
npm run dev
# или
yarn dev
```

Приложение будет доступно по адресу: **http://localhost:3000**

## Структура проекта

```
gto-protocol-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── protocols/            # REST API для протоколов
│   │       ├── route.ts          # GET (list), POST (create)
│   │       └── [id]/route.ts     # GET, PUT, DELETE (by id)
│   ├── admin/                    # Админ-панель
│   │   └── page.tsx              # Управление справочниками
│   ├── login/                    # Страница входа
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout с AuthProvider
│   ├── page.tsx                  # Главная страница (список протоколов)
│   └── globals.css               # Глобальные стили и design tokens
├── components/
│   ├── auth/                     # Компоненты аутентификации
│   │   ├── auth-provider.tsx     # Context для пользователя
│   │   ├── login-form.tsx        # Форма входа
│   │   └── protected-route.tsx   # HOC для защищенных маршрутов
│   ├── admin/                    # Компоненты админ-панели
│   │   ├── levels-manager.tsx    # Управление уровнями выполнения
│   │   ├── sport-titles-manager.tsx  # Управление спортивными званиями
│   │   ├── test-types-manager.tsx    # Управление видами испытаний
│   │   └── text-mappings-manager.tsx # Маппинг текст→число
│   ├── protocol-form.tsx         # Форма создания/редактирования протокола
│   ├── protocols-list.tsx        # Таблица протоколов с CRUD
│   ├── protocols-filter.tsx      # Фильтры и поиск
│   └── protocol-view.tsx         # Детальный просмотр протокола
├── lib/
│   ├── types.ts                  # TypeScript типы и интерфейсы
│   ├── validation.ts             # Zod схемы валидации
│   ├── storage.ts                # Работа с данными (localStorage/API)
│   ├── csv-export.ts             # Экспорт в CSV
│   └── filter-utils.ts           # Утилиты для фильтрации
├── prisma/
│   ├── schema.prisma             # Prisma схема БД
│   └── seed.ts                   # Seed данные для разработки
└── public/                       # Статические файлы
```

## Основной функционал

### 1. Форма протокола

Форма включает следующие поля с валидацией:

#### Обязательные поля:

- **Вид испытания** (select) — выбор из справочника
- **Дата выполнения** — три отдельных select:
  - День (1–31, с учетом количества дней в месяце)
  - Месяц (1–12)
  - Год (1900–текущий год)
  - Валидация високосных годов и корректности дат
- **Результат выполнения** (number) — числовое значение
  - Поддержка преобразования текста в число через маппинг
- **Уровень выполнения** (select) — bronze/silver/gold

#### Опциональные поля:

- **Спортивное звание** (select) — выбор из справочника
- **Срок действия звания**:
  - Дата начала (обязательна, если указано звание)
  - Дата окончания (обязательна, если указано звание)
  - Валидация: дата начала ≤ дата окончания

### 2. Валидация данных

#### Фронтенд (React Hook Form + Zod):

```typescript
// Пример схемы валидации
const protocolSchema = z.object({
  testType: z.string().min(1, "Выберите вид испытания"),
  dateDay: z.number().min(1).max(31),
  dateMonth: z.number().min(1).max(12),
  dateYear: z.number().min(1900).max(new Date().getFullYear()),
  resultValue: z.number().positive("Результат должен быть положительным"),
  level: z.enum(["bronze", "silver", "gold"]),
  sportTitle: z.string().optional(),
  sportTitleFrom: z.date().optional(),
  sportTitleTo: z.date().optional(),
}).refine(/* валидация дат */);
```

#### Бэкенд (API Routes):

- Повторная валидация всех данных на сервере
- Проверка корректности дат (високосные годы, количество дней)
- Санитизация входных данных (trim, escape)
- Проверка прав доступа

### 3. CRUD операции

#### REST API Endpoints:

**GET /api/protocols**  
Получение списка протоколов  
Поддержка фильтрации и пагинации  
Query параметры:

- `testType` — фильтр по виду испытания
- `level` — фильтр по уровню (bronze/silver/gold)
- `dateFromDay`, `dateFromMonth`, `dateFromYear` — дата от
- `dateToDay`, `dateToMonth`, `dateToYear` — дата до
- `page` — номер страницы (default: 1)
- `limit` — записей на странице (default: 10)

**GET /api/protocols/[id]**  
Получение одного протокола по ID

**POST /api/protocols**  
Создание нового протокола  
Body: JSON с полями протокола  
Возвращает созданный протокол

**PUT /api/protocols/[id]**  
Обновление существующего протокола  
Body: JSON с обновленными полями

**DELETE /api/protocols/[id]**  
Удаление протокола по ID

### 4. Фильтрация и поиск

Доступные фильтры:

- Поиск по тексту (вид испытания)
- Фильтр по виду испытания (select)
- Фильтр по уровню выполнения (select)
- Фильтр по диапазону дат (три select для "от" и "до")
- Сортировка по дате, виду испытания, уровню

### 5. Экспорт в CSV

Функционал экспорта:

- Экспорт всех протоколов
- Экспорт отфильтрованных данных
- Формат CSV с заголовками на русском языке
- Поля: Вид испытания, Дата, Результат, Уровень, Спортивное звание, Срок действия

Пример CSV:

```csv
Вид испытания,День,Месяц,Год,Результат,Уровень,Спортивное звание,Дата начала,Дата окончания
Бег 100м,15,3,2024,12.5,gold,Мастер спорта,2023-01-01,2027-01-01
```

### 6. Админ-панель

Доступна по адресу: **/admin** (только для администраторов)

Управление справочниками:

#### Виды испытаний

- Добавление/редактирование/удаление видов испытаний
- Поля: название, описание

#### Уровни выполнения

- Управление уровнями (bronze, silver, gold)
- Поля: код, название, описание

#### Спортивные звания

- Управление списком спортивных званий
- Поля: название, описание

#### Маппинг текст → число

- Настройка преобразования текстовых результатов в числовые
- Пример: "Отлично" → 5, "Хорошо" → 4
- Используется при вводе результатов в форме

### 7. Безопасность

Реализованные меры безопасности:

#### Аутентификация и авторизация:

- Защита всех страниц через `ProtectedRoute`
- Проверка прав доступа в API routes
- Разделение ролей: admin (полный доступ), user (только просмотр)

#### Валидация и санитизация:

- Двойная валидация (фронтенд + бэкенд)
- Санитизация всех входных данных (trim, escape)
- Защита от SQL injection через Prisma ORM
- Защита от XSS через React автоэкранирование

#### Audit logging:

- Логирование всех операций создания/изменения/удаления
- Сохранение: кто, когда, что изменил
- Просмотр логов в админ-панели

## Модель данных

### Prisma Schema

```prisma
model Protocol {
  id              String    @id @default(cuid())
  testType        String    // Вид испытания
  dateDay         Int       // День (1-31)
  dateMonth       Int       // Месяц (1-12)
  dateYear        Int       // Год
  resultValue     Float     // Результат (число)
  level           String    // Уровень (bronze/silver/gold)
  sportTitle      String?   // Спортивное звание (опционально)
  sportTitleFrom  DateTime? // Дата начала действия звания
  sportTitleTo    DateTime? // Дата окончания действия звания
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([testType])
  @@index([level])
  @@index([dateYear, dateMonth, dateDay])
}

model TestType {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
}

model Level {
  id          String   @id @default(cuid())
  code        String   @unique // bronze, silver, gold
  name        String
  description String?
  createdAt   DateTime @default(now())
}

model SportTitle {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
}

model TextMapping {
  id          String   @id @default(cuid())
  textValue   String   @unique
  numericValue Float
  createdAt   DateTime @default(now())
}

model AuditLog {
  id          String   @id @default(cuid())
  action      String   // create, update, delete
  entityType  String   // protocol, testType, etc.
  entityId    String
  userId      String
  userName    String
  changes     Json?    // Детали изменений
  createdAt   DateTime @default(now())

  @@index([entityType, entityId])
  @@index([userId])
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
    "sportTitleFrom": "2023-01-01T00:00:00Z",
    "sportTitleTo": "2027-01-01T00:00:00Z"
  }'
```

### Получение списка с фильтрами

```bash
# Все протоколы с пагинацией
curl "http://localhost:3000/api/protocols?page=1&limit=10"

# Фильтр по виду испытания и уровню
curl "http://localhost:3000/api/protocols?testType=Бег%20100м&level=gold"

# Фильтр по диапазону дат
curl "http://localhost:3000/api/protocols?dateFromDay=1&dateFromMonth=1&dateFromYear=2024&dateToDay=31&dateToMonth=12&dateToYear=2024"
```

### Обновление протокола

```bash
curl -X PUT http://localhost:3000/api/protocols/clx123abc \
  -H "Content-Type: application/json" \
  -d '{
    "resultValue": 13.0,
    "level": "silver"
  }'
```

### Удаление протокола

```bash
curl -X DELETE http://localhost:3000/api/protocols/clx123abc
```

## Seed данные

Для заполнения базы тестовыми данными создайте файл `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Виды испытаний
  await prisma.testType.createMany({
    data: [
      { name: 'Бег 100м', description: 'Бег на короткую дистанцию' },
      { name: 'Бег 3000м', description: 'Бег на длинную дистанцию' },
      { name: 'Подтягивание', description: 'Подтягивание на перекладине' },
      { name: 'Отжимание', description: 'Отжимание от пола' },
      { name: 'Прыжок в длину', description: 'Прыжок в длину с места' },
    ],
  })

  // Уровни выполнения
  await prisma.level.createMany({
    data: [
      { code: 'bronze', name: 'Бронзовый', description: 'Бронзовый значок ГТО' },
      { code: 'silver', name: 'Серебряный', description: 'Серебряный значок ГТО' },
      { code: 'gold', name: 'Золотой', description: 'Золотой значок ГТО' },
    ],
  })

  // Спортивные звания
  await prisma.sportTitle.createMany({
    data: [
      { name: 'Мастер спорта', description: 'Мастер спорта России' },
      { name: 'КМС', description: 'Кандидат в мастера спорта' },
      { name: '1 разряд', description: 'Первый спортивный разряд' },
      { name: '2 разряд', description: 'Второй спортивный разряд' },
      { name: '3 разряд', description: 'Третий спортивный разряд' },
    ],
  })

  // Маппинг текст → число
  await prisma.textMapping.createMany({
    data: [
      { textValue: 'Отлично', numericValue: 5 },
      { textValue: 'Хорошо', numericValue: 4 },
      { textValue: 'Удовлетворительно', numericValue: 3 },
      { textValue: 'Неудовлетворительно', numericValue: 2 },
    ],
  })

  // Примеры протоколов
  await prisma.protocol.createMany({
    data: [
      {
        testType: 'Бег 100м',
        dateDay: 15,
        dateMonth: 3,
        dateYear: 2024,
        resultValue: 12.5,
        level: 'gold',
        sportTitle: 'Мастер спорта',
        sportTitleFrom: new Date('2023-01-01'),
        sportTitleTo: new Date('2027-01-01'),
      },
      {
        testType: 'Подтягивание',
        dateDay: 20,
        dateMonth: 4,
        dateYear: 2024,
        resultValue: 15,
        level: 'silver',
      },
    ],
  })

  console.log('Seed данные успешно добавлены!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Добавьте в `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Запустите seed:

```bash
npx prisma db seed
```

## Аутентификация

### Демо-пользователи

Для тестирования используйте следующие учетные данные:

| Логин  | Пароль | Роль           | Права доступа                     |
|--------|--------|----------------|-----------------------------------|
| admin  | admin  | Администратор  | Полный доступ ко всем функциям    |
| user   | user   | Пользователь   | Только просмотр протоколов        |

### Роли и права

- **Администратор (admin)**:
  - Создание/редактирование/удаление протоколов
  - Доступ к админ-панели
  - Управление справочниками
  - Просмотр audit логов

- **Пользователь (user)**:
  - Просмотр списка протоколов
  - Фильтрация и поиск
  - Экспорт в CSV

## Мобильная адаптивность

Приложение полностью адаптировано для мобильных устройств:

- Responsive дизайн с breakpoints: mobile (< 768px), tablet (768–1024px), desktop (> 1024px)
- Touch-friendly интерфейс (минимальный размер кнопок 44×44px)
- Мобильное меню-шторка для навигации
- Карточки вместо таблиц на маленьких экранах
- Оптимизированные формы для сенсорного ввода
- Липкий header для удобной навигации

## Тестирование

### Unit тесты

```bash
# Запуск всех unit тестов
npm run test

# Запуск с coverage
npm run test:coverage

# Watch режим
npm run test:watch
```

Примеры тестов:

```typescript
// lib/validation.test.ts
describe('Protocol Validation', () => {
  it('should validate correct protocol data', () => {
    const data = {
      testType: 'Бег 100м',
      dateDay: 15,
      dateMonth: 3,
      dateYear: 2024,
      resultValue: 12.5,
      level: 'gold',
    }
    expect(protocolSchema.parse(data)).toEqual(data)
  })

  it('should reject invalid date', () => {
    const data = {
      testType: 'Бег 100м',
      dateDay: 31,
      dateMonth: 2, // Февраль не имеет 31 дня
      dateYear: 2024,
      resultValue: 12.5,
      level: 'gold',
    }
    expect(() => protocolSchema.parse(data)).toThrow()
  })
})
```

### E2E тесты

```bash
# Установка Playwright
npx playwright install

# Запуск E2E тестов
npm run test:e2e

# Запуск в UI режиме
npm run test:e2e:ui
```

Пример E2E теста:

```typescript
// e2e/protocol-crud.spec.ts
test('should create new protocol', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.click('text=Создать протокол')

  await page.selectOption('[name="testType"]', 'Бег 100м')
  await page.selectOption('[name="dateDay"]', '15')
  await page.selectOption('[name="dateMonth"]', '3')
  await page.selectOption('[name="dateYear"]', '2024')
  await page.fill('[name="resultValue"]', '12.5')
  await page.selectOption('[name="level"]', 'gold')

  await page.click('button[type="submit"]')

  await expect(page.locator('text=Протокол успешно создан')).toBeVisible()
})
```

## Разработка

### Добавление новых полей в протокол

1. Обновите Prisma схему:

   ```prisma
   model Protocol {
     // ... existing fields ...
     newField String? // Новое поле
   }
   ```

2. Создайте и примените миграцию:

   ```bash
   npx prisma migrate dev --name add_new_field
   ```

3. Обновите TypeScript типы в `lib/types.ts`:

   ```typescript
   export interface Protocol {
     // ... existing fields ...
     newField?: string
   }
   ```

4. Обновите Zod схему в `lib/validation.ts`:

   ```typescript
   export const protocolSchema = z.object({
     // ... existing fields ...
     newField: z.string().optional(),
   })
   ```

5. Обновите форму в `components/protocol-form.tsx`

### Добавление нового справочника

1. Создайте модель в Prisma схеме
2. Создайте API endpoints в `app/api/`
3. Создайте manager компонент в `components/admin/`
4. Добавьте вкладку в админ-панель

### Кастомизация дизайна

Все цвета и стили настраиваются через design tokens в `app/globals.css`:

```css
@theme inline {
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  /* ... другие токены ... */
}
```

## Troubleshooting

### Проблема: Ошибка подключения к БД

**Решение:**

1. Проверьте, что PostgreSQL запущен: `pg_isready`
2. Проверьте `DATABASE_URL` в `.env`
3. Убедитесь, что база данных создана: `createdb gto_db`

### Проблема: Ошибка гидратации React

**Решение:**

1. Очистите кэш браузера
2. Удалите `.next` папку: `rm -rf .next`
3. Перезапустите dev сервер

### Проблема: Prisma Client не найден

**Решение:**

```bash
npx prisma generate
```

### Проблема: Миграции не применяются

**Решение:**

```bash
# Сброс базы данных (ВНИМАНИЕ: удалит все данные!)
npx prisma migrate reset

# Применить все миграции
npx prisma migrate deploy
```

## Production Deployment

### Рекомендации для production:

1. **База данных:**
   - Используйте PostgreSQL (не `localStorage`)
   - Настройте connection pooling
   - Включите SSL для подключения

2. **Безопасность:**
   - Замените демо-аутентификацию на NextAuth.js или Auth0
   - Используйте криптостойкий `SESSION_SECRET`
   - Настройте CORS и rate limiting
   - Включите HTTPS

3. **Производительность:**
   - Настройте кэширование (Redis)
   - Оптимизируйте запросы к БД (индексы)
   - Используйте CDN для статики
   - Включите compression

4. **Мониторинг:**
   - Настройте логирование (Winston, Pino)
   - Добавьте мониторинг ошибок (Sentry)
   - Настройте метрики (Prometheus)
   - Добавьте health checks

5. **CI/CD:**
   - Автоматические тесты перед деплоем
   - Автоматические миграции БД
   - Rollback стратегия
   - Staging окружение

### Деплой на Vercel:

```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой
vercel

# Production деплой
vercel --prod
```

Настройте environment variables в Vercel Dashboard:

- `DATABASE_URL`
- `SESSION_SECRET`
- `NODE_ENV=production`

## Лицензия

MIT

## Поддержка

Для вопросов и предложений создавайте issues в репозитории проекта.
