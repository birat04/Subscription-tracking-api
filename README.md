# SubTrack — Full-stack subscription tracker (SaaS)

SubTrack is a subscription management app built with **Next.js 15 (App Router)**, **TypeScript**, **Prisma**, **PostgreSQL** (or **MySQL** with a schema provider change), **JWT** in HTTP-only cookies (`jose`), **Tailwind CSS v4**, **shadcn/ui**, **TanStack Query**, **React Hook Form + Zod**, **Nodemailer**, **Upstash QStash**, and **Arcjet**. The Express backend is replaced by **Next.js Route Handlers** (`app/api/**`).

## Features

- **Auth**: sign up, sign in, sign out, protected routes and APIs  
- **Subscriptions**: CRUD, cancel, renew, pagination  
- **Dashboard**: monthly spend, category breakdown, upcoming renewals, charts (Recharts)  
- **Security**: Arcjet, CSP headers in `next.config.ts`, Zod on inputs  
- **Reminders**: `POST /api/reminders` for QStash cron + email  

## Setup

1. **Install**

   ```bash
   npm install
   ```

2. **Environment** — copy `.env.example` to `.env` and set at least:

   - `DATABASE_URL` — PostgreSQL (default) or MySQL (change `provider` in `prisma/schema.prisma`)  
   - `JWT_SECRET`  
   - Optional: `ARCJET_KEY`, SMTP, QStash keys, `NEXT_PUBLIC_APP_URL`  

3. **Database**

   ```bash
   npx prisma migrate dev --name init
   ```

   Or for quick local iteration without migration files:

   ```bash
   npx prisma db push
   ```

4. **Dev server**

   ```bash
   npm run dev
   ```

## MySQL

Set `DATABASE_URL` to a MySQL URL and in `prisma/schema.prisma` set:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

Then run `npx prisma migrate dev` (or `db push`) again.

## Scripts

| Script            | Description              |
|-------------------|--------------------------|
| `npm run dev`     | Next dev (Turbopack)     |
| `npm run build`   | `prisma generate` + build |
| `npm run db:migrate` | `prisma migrate dev`  |
| `npm run db:push` | `prisma db push`         |
| `npm run db:studio` | Prisma Studio          |

## Project layout

- `app/` — routes, layouts, API handlers  
- `components/` — UI (including shadcn primitives)  
- `hooks/` — TanStack Query hooks  
- `lib/` — Prisma client, JWT, Arcjet, utils  
- `prisma/schema.prisma` — data model  
- `providers/` — client providers (e.g. React Query)  
- `schemas/` — shared Zod schemas  
- `services/` — browser `fetch` wrappers  
- `types/` — shared TypeScript types  

## Production

Configure env vars on the host (e.g. Vercel). Use a managed Postgres (Neon, Supabase, Railway, etc.) or MySQL (PlanetScale, etc.).
