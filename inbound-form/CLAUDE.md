# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # dev server at http://localhost:3000
npm run build        # production build
npm run lint         # ESLint

npm run db:generate  # generate SQL migration files from schema.ts changes
npm run db:migrate   # apply pending migrations to Supabase
npm run db:studio    # open Drizzle Studio (DB GUI)
```

Schema changes always require both `db:generate` then `db:migrate`.

## Environment

`.env.local` (not committed) must contain:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=  # Supabase Transaction pooler URL (port 6543)
```

`drizzle.config.ts` loads `.env.local` via `@next/env` so `db:generate` / `db:migrate` pick up `DATABASE_URL` without extra tooling.

## Architecture

**Stack:** Next.js App Router · React 19 · Tailwind CSS v4 · Drizzle ORM · postgres.js · Supabase PostgreSQL

**Data flow for form submission:**
1. `src/app/components/LeadForm.tsx` (Client Component) — validates input, calls Server Action via `useTransition`
2. `src/app/actions/submitLead.ts` (Server Action) — receives typed data, inserts into DB
3. `src/db/index.ts` — exports `db` (Drizzle instance); `prepare: false` is required for Supabase's PgBouncer transaction pooler
4. `src/db/schema.ts` — single source of truth for table definitions; all schema changes start here

**Adding a new table:** define it in `src/db/schema.ts`, run `db:generate` + `db:migrate`, then import from `@/db/schema` in server-side code.
