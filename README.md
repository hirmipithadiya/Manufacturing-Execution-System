<<<<<<< HEAD
# Manufacturing-Execution-System
=======
# ForgeFlow MES

ForgeFlow MES is a cloud-native smart manufacturing execution and intelligence platform built for the AI Mahakurukshetra hackathon. It is a judge-friendly Plex Systems alternative focused on the most demoable MES workflows for small-to-mid manufacturers.

## What It Does

ForgeFlow helps plant teams manage:

- Production orders and execution status
- Digital work instructions
- Quality checks and non-conformance context
- Material lot traceability
- Inventory visibility
- ERP sync monitoring
- Plant KPI reporting

## Target Users

- Plant Managers
- Production Planners
- Shop Floor Operators
- Quality Inspectors

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS 4
- Supabase Auth and Postgres
- Vercel deployment target

## Key Screens

- `/` landing page
- `/login` and `/signup` auth entry points
- `/dashboard` production command center
- `/production-orders` order planning and execution
- `/work-instructions` operator guidance
- `/quality` inspection and CAPA view
- `/traceability` lot genealogy
- `/inventory` stock snapshot
- `/erp-sync` integration monitor
- `/reports` KPI and report packs
- `/settings` environment and deployment checklist

## Alternative To

This project is positioned as a modern, lighter-weight alternative to Plex Systems for manufacturers that want cloud-native execution visibility without heavy legacy UX.

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy the environment file:

```bash
cp .env.example .env.local
```

3. Add your real Supabase anon key to `.env.local`.

4. Start the app:

```bash
pnpm dev
```

The app runs in populated demo mode if a valid `NEXT_PUBLIC_SUPABASE_ANON_KEY` is not present yet.

## Supabase Setup

1. Create a Supabase project.
2. Add these env vars locally and in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the SQL files in this order inside the Supabase SQL editor:

- [`supabase/schema.sql`](/home/bacancy/Documents/Intelligence-Platforn/supabase/schema.sql)
- [`supabase/seed.sql`](/home/bacancy/Documents/Intelligence-Platforn/supabase/seed.sql)

4. Use the app signup flow to create your first authenticated user.

## Quality Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Deployment

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Add:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

4. Deploy.

## Notes

- No secrets are hardcoded.
- The current codebase is designed to keep demo data visible even before Supabase auth is fully wired with a real anon key.
- The supplied project URL is already placed in `.env.example` for convenience.
>>>>>>> 1fe3f3b (Initial commit)
