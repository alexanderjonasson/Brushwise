# Brushwise

An AI-powered painting assistant for miniature hobbyists. Photograph the miniatures you paint and get feedback from AI, get painting recipes built from the paints you own, and keep track of your collection – from unpainted to done.

By [Alexander Jonasson](https://github.com/alexanderjonasson).

> **Status:** early development. See [PLAN.md](PLAN.md) for the roadmap (in Swedish).

## Tech stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router) with React 19 |
| Language | TypeScript in strict mode |
| Database | PostgreSQL in Docker, with Prisma as the ORM |
| Styling | Tailwind CSS |
| AI | Claude API (coming in a later step) |

## Getting started

You need Node.js and Docker Desktop.

```bash
git clone https://github.com/alexanderjonasson/brushwise.git
cd brushwise
cp .env.example .env      # then set your own password, in both places
npm install
npm run db:up             # starts PostgreSQL in Docker on port 5434
npm run dev
```

Open [http://localhost:3002](http://localhost:3002). Brushwise uses its own ports (app 3002, database 5434) so it can run next to other projects.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server |
| `npm run build` | Generates the Prisma client and builds the app |
| `npm run lint` | Runs ESLint |
| `npm run typecheck` | Type-checks the project |
| `npm test` | Runs the unit tests with Vitest |
| `npm run db:up` | Starts the database in Docker |
| `npm run db:migrate` | Creates and applies a migration after a schema change |
| `npm run db:studio` | Opens Prisma Studio to browse the data |
