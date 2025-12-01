import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: './prisma/migrations',
  datasources: {
    db: {
      url: env('DATABASE_URL'),
    },
  },
});
