import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Для CLI команд нужен прямой PostgreSQL URL (не через Accelerate)
// Если DIRECT_DATABASE_URL не задан, используется DATABASE_URL
const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'Требуется переменная окружения DATABASE_URL или DIRECT_DATABASE_URL.\n' +
    'Для CLI команд (migrate, introspect, db push) используйте DIRECT_DATABASE_URL с прямым PostgreSQL URL.\n' +
    'Для runtime приложения используйте DATABASE_URL с Prisma Accelerate URL.'
  );
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
