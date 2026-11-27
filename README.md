# Brushwise

An AI painting coach for miniature hobbyists. Photograph the miniatures you paint and get honest, practical feedback from AI, get painting recipes built from the paints you already own, and keep track of your collection and your pile of shame.

I've painted miniatures for years and wanted feedback between painting sessions, so I built the tool I wanted myself. It's also where I practise building AI features the way real products need them: structured answers, cost limits, and a human in the loop.

By [Alexander Jonasson](https://github.com/alexanderjonasson).

**Live demo:** [brushwise.vercel.app](https://brushwise.vercel.app) – create a free account to try it. AI requests are limited per day.

## Features

**AI feedback on your paint jobs**
- Upload a photo of a painted miniature and get an overall score, a short summary, and a score, comment and concrete tip for each area (basecoat, shading, highlights, edges, basing and more)
- A "practise next" list with the most useful things to work on

**Painting recipes from your own paints**
- Name any miniature, a look you want and a preferred brand, and get a step-by-step recipe
- See which paints you're missing, the closest paint you already own, and AI suggestions for what to mix instead
- Switch the whole recipe between Citadel, Vallejo and The Army Painter to see the closest match for every step

**Your paints**
- A list of 167 Citadel, Vallejo and Army Painter paints to search and add
- Or photograph your paint rack, and AI reads the labels and suggests which paints you own – you choose what gets added

**Collection and pile of shame**
- Track every miniature from unpainted to in progress to done, with a gallery of photos for each
- Search 483 miniatures from Warhammer 40,000, Horus Heresy, Age of Sigmar, Middle-earth, Star Wars and Dungeons & Dragons when adding one; the faction fills itself in
- Photograph a box from your pile of shame and AI reads the name, faction and number of models. "Start painting one" moves a model into your collection

## Tech stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions, Cache Components) with React 19 |
| Language | TypeScript in strict mode |
| Database | PostgreSQL with Prisma as the ORM – Docker locally, Neon in production |
| Auth | Better Auth, email and password |
| AI | Claude API (`@anthropic-ai/sdk`) with vision and structured outputs |
| File storage | Vercel Blob for photos |
| Validation | Zod – for forms and for every AI answer |
| Styling | Tailwind CSS, light and dark mode |
| Testing | Vitest (60 unit tests) |
| Hosting | Vercel in Frankfurt, next to a Neon database |

## How it works

### The AI parts

- **Structured outputs, not free text.** Every AI call sends a Zod schema as the required answer format, so Claude always returns JSON with exactly the right fields. The same schema validates the answer again when it is read back from the database, so the page never renders something it doesn't understand (`src/lib/feedback.ts`, `src/lib/recipes.ts`).
- **The AI can't invent paints.** Recipes and paint scans may only answer with ids from our own paint list – the list of ids is part of the schema. Which paints the user owns, what's missing and the closest match from each brand are then worked out in plain, unit-tested code (`src/lib/paints.ts`).
- **A human in the loop.** When AI reads paint labels or a box, it only suggests. Nothing is saved until the user has checked the result, and uncertain matches are marked and left unticked.
- **Costs stay bounded.** Each user gets 10 AI requests per day, and the whole app has a daily cap on top. Every request is logged before the call, so slow or failed calls still count and deleting things doesn't give the allowance back (`src/lib/ai-usage.ts`).
- **Free to develop and test.** With `AI_MODE=mock` (the default) the app returns realistic example answers instead of calling the API, so development and tests never cost money. The interface marks example answers clearly.
- **Failures are friendly.** Refusals, incomplete answers and API errors become clear messages instead of crashes, and server-side fallback retries a request that a safety classifier wrongly declines.

### Photos

- **Shrunk in the browser first.** Phone photos are often 5–10 MB, more than a Vercel request can carry. The browser scales them down to 2000 px and converts them to WebP before upload (`src/lib/resize-image.ts`).
- **The file's type is checked from its bytes.** The browser's file type only comes from the file name, so the server reads the first bytes of the file ("magic bytes") to confirm it really is a JPEG, PNG or WebP (`src/lib/photos.ts`).
- **No orphaned files.** Deleting a photo, a miniature or a box also deletes the files in Vercel Blob, not just the database rows.

### Security and data

- **Every check runs on the server.** A small data access layer (`src/lib/dal.ts`, marked `server-only`) is called by every page and Server Action.
- **You can only touch your own data.** Updates and deletes filter on both the id and the signed-in user's id (`updateMany` / `deleteMany`), so sending someone else's id changes nothing. Someone else's miniature gives the same 404 as one that doesn't exist.
- **Sign-in doesn't reveal accounts.** An unknown email and a wrong password give the same message.
- **Partial prerendering.** Pages are prerendered as static HTML, and only the parts that read the session cookie render per request inside `<Suspense>`.

### Accessibility

- The miniature search is an accessible combobox (ARIA roles, arrow keys, Enter and Escape)
- Labels on every input, visible focus rings, a skip link, and status messages announced with `aria-live`
- Works on mobile, with no horizontal scrolling

## Getting started

You need Node.js and Docker Desktop.

```bash
git clone https://github.com/alexanderjonasson/Brushwise.git
cd Brushwise
cp .env.example .env      # then fill in the values – see the comments in the file
npm install
npm run db:up             # starts PostgreSQL in Docker on port 5434
npm run db:migrate        # creates the tables
npm run dev
```

Open [http://localhost:3002](http://localhost:3002). Brushwise uses its own ports (app 3002, database 5434) so it can run next to other projects.

**AI and photos are optional locally.** Without an Anthropic API key, leave `AI_MODE="mock"` and every AI feature returns an example answer. Photo uploads need a Vercel Blob token (`BLOB_READ_WRITE_TOKEN`).

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

## Deployment

The app runs on Vercel with a Neon PostgreSQL database in Frankfurt. Every merge to `main` deploys automatically, and `vercel.json` applies database migrations before each build.

## Notes

- The miniature and paint lists are our own (names only), since the publishers have no public APIs. Paint colours are approximations for swatches and near matches.
- Dungeons & Dragons entries use generic and open-licence (SRD) monster names.
- Brushwise is a hobby project and isn't affiliated with Games Workshop, Vallejo, The Army Painter or any other publisher.
