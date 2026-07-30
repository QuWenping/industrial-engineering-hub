# Industrial Engineering Hub

> An SEO-focused industrial engineering calculator & reference site, with a built-in AI content factory for solo operators.

**Production:** [industrialengineeringhub.com](https://industrialengineeringhub.com)

## Stack

- **Frontend:** Next.js 16 (App Router, React 19), Tailwind v4, shadcn/ui on Base UI
- **Backend (V0.2+):** Next.js Route Handlers, Prisma 7 on Neon Serverless Postgres
- **AI:** Anthropic Claude API (Sonnet 4.6 for writing/review, Haiku 4.5 for keyword analysis), Zod-validated structured output
- **Auth:** Single-admin password + HMAC-SHA256 signed cookies (no heavy auth lib)
- **Content:** MDX guides/materials + JSON calculator definitions, committed to `main` via Octokit → Vercel auto-deploy
- **Hosting:** Vercel (Hobby). Admin runs locally only (Sonnet 15–30s generation exceeds 10s function limit).

## Repository layout

```
content/
  calculators/*.json     # 53 calculator definitions (truth source for public site)
  guides/*.mdx           # engineering guides
  materials/*.mdx        # material reference pages
src/
  app/                   # Next.js App Router pages
    (public)/, tools/, guides/, materials/
    admin/               # Admin UI (local-only)
    api/admin/           # Admin API routes
  components/
    calculator/, mdx/, layout/, seo/, search/, ui/
    admin/               # Admin UI components (Sidebar, SchemaBuilder, MdxEditor, …)
  lib/
    calculator/          # engine, parser, units, validator, loader, types
    ai/
      client.ts, models.ts, pricing.ts
      agents/            # keyword, writer, reviewer, calc-writer
    auth/                # password.ts (SHA-256), session.ts (HMAC cookie)
    admin/               # status-machine.ts
    publish/             # git.ts (Octokit), mdx-serialize.ts, calc-serialize.ts
    db.ts                # Prisma singleton
prisma/
  schema.prisma
  seed.ts                # imports existing content/ into Postgres
prisma.config.ts         # Prisma 7 datasource config
```

## V0.2 architecture (Admin + AI Content Factory)

The admin is **mode A — publish via git commit**: the database is the authoring workspace; approved content is serialized back to MDX/JSON in this repo and committed to `main`; Vercel's normal git-based deploy ships it to production. This keeps the public site a purely static Next.js build with no DB dependency at request time.

Content status machine:

```
keyword → brief_generated → ai_draft → engineering_review → seo_review → published
                                                                          ↓
                                                                       archived
```

AI agents:

| Agent | Model | Purpose |
|-------|-------|---------|
| `keyword` | Haiku | Analyze a seed phrase → SEO brief (intent, priority, volume, outline, formulas) |
| `writer` | Sonnet | Produce a full MDX guide/material with `<Formula>`, `<Calculator>`, FAQ |
| `reviewer` | Sonnet | 4-dimension score (accuracy 40%, logic 30%, SEO 20%, originality 10%) + verdict |
| `calc-writer` | Sonnet | Produce a Calculator JSON, validated with `runTests()`; retries up to 3× |

All AI output is Zod-parsed; calculators must pass the engine test runner before they're persisted.

## Local development

### Prerequisites

- Node.js 20+
- A Neon Postgres database (free tier is fine)
- An Anthropic API key
- A GitHub Personal Access Token with `contents:write` (for publishing)

### Setup

```bash
npm install

# 1. Copy env template and fill in values
cp .env.example .env.local

# 2. Generate ADMIN_PASSWORD_HASH
node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex'))"

# 3. Generate ADMIN_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Push schema to Neon and generate Prisma client
npx prisma generate
npm run db:push

# 5. Seed existing 53 calculators + 50 guides + 26 materials
npm run db:seed

# 6. Run the dev server
npm run dev
```

Visit http://localhost:3000 for the public site, http://localhost:3000/admin for the console (log in with the password you hashed).

### Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local dev server (with admin enabled) |
| `npm run build` | Production build (public routes statically generated) |
| `npm run db:push` | Sync Prisma schema to Neon (no migrations file — dev-friendly) |
| `npm run db:studio` | Open Prisma Studio at localhost:5555 |
| `npm run db:seed` | Import content/ files into Postgres (idempotent) |
| `npm run test:calculators` | Run engine tests against all JSON calculators |

## Deployment to Vercel

The public site deploys normally via the Vercel GitHub integration. The `/admin/*` routes are gated by the proxy and will redirect to `/admin/login` in production — **do not enter your password there**; AI generation times out on Hobby's 10s limit. Run admin locally and use the Publish button to commit content; Vercel auto-deploys ~60–90s after the commit lands on `main`.

For full setup instructions including environment variables, see [`docs/DEPLOY_V02.md`](docs/DEPLOY_V02.md).

## Versioning

- **V0.1** (current on production) — 53 calculators, 50 guides, 26 materials, all static. ✅ Shipped.
- **V0.2** (this branch) — Admin backend, AI content factory, git-based publish pipeline. In progress.
- **V0.3+** (planned) — GSC auto-sync, rank tracker, knowledge graph UI, RBAC, background workers.

## License

All rights reserved. Content is © Industrial Engineering Hub.
