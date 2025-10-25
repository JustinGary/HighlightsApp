# HighlightsApp

An MVP architecture for an intelligent highlights management platform that imports Kindle exports and manual notes, schedules spaced repetition reviews, and orchestrates weekly digest emails.

## Getting started

```bash
npm install
npm run dev
```

The development server starts on [http://localhost:3000](http://localhost:3000). The in-memory repositories seed demo data the first time you load the dashboard.

## Available scripts

- `npm run dev` – Launch the Next.js development server.
- `npm run build` – Generate a production build.
- `npm run start` – Run the production server after building.
- `npm run lint` – Run ESLint using Next.js defaults.
- `npm run typecheck` – Validate TypeScript types without emitting JavaScript.

## Project structure

```
app/
  analytics/          Analytics snapshots sourced from in-memory data
  api/                Route handlers for imports, notes, reviews, and digests
  digests/            Digest scheduling surface with preview controls
  imports/            Manual note capture and simulated Kindle imports
  library/            Highlight browsing and tag summaries
  page.tsx            Dashboard overview for the MVP
components/
  dashboard/          UI primitives for dashboard sections
lib/
  email/              Email template rendering for weekly digests
  mock/               Demo data seeding and dashboard snapshot helpers
  repositories/       In-memory data stores representing the future database layer
  services/           Domain services for imports, digests, reviews, and notes
  validation.ts       Zod schemas used across API handlers
```

## Next steps

- Replace the in-memory repositories with a relational database (e.g., PostgreSQL via Prisma).
- Wire background job processing (BullMQ or similar) for long-running imports and digest generation.
- Integrate an email provider (e.g., SendGrid) using the HTML template defined in `lib/email/digestTemplate.ts`.
- Expand the spaced repetition scheduler with per-highlight history and quiz-based feedback.
