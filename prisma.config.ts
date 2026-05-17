import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Use process.env here so commands like `prisma generate` can still run in env-less CI.
    url: process.env.DB_URI ?? '',
  },
});
