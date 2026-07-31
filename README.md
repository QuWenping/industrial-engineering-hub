# Industrial Engineering Hub

> An SEO-focused industrial engineering calculator & reference site, with a built-in AI content factory for solo operators.

**Production:** [industrialengineeringstudio.com](https://www.industrialengineeringstudio.com)
## Agent 协作规则（接手本项目的 agent 必读）

任何 agent 接手本项目时，**先完整读本 README**，再读 `AGENTS.md` 和 `CLAUDE.md`，了解技术栈、目录结构、部署方式与已知坑，然后按下列规则协作：

1. **先读文档，再动手**：开工前通读本 README + `AGENTS.md`；涉及 Next.js 16 时按 `AGENTS.md` 要求查阅 `node_modules/next/dist/docs/`，不要凭训练数据假设 API。
2. **按计划推进**：以 Obsidian 中的 [[ieh-plan]] / Sprint 规划为优先级来源；每开始一项任务先确认它在计划里的位置，做完一项再取下一项，不跳跃。
3. **完成的任务及时标记**：任务完成立即在 Obsidian `03-Projects/industrial-engineering-hub/ieh-progress.md` 勾选/标 ✅，并补 commit 记录；不要积攒到最后才更新。
4. **每个节点写经验总结**：完成一个功能节点或修完一个 bug，把「问题 → 原因 → 解决 → 经验」写到 Obsidian `ieh-sprints.md`（Sprint 日志）或单独的 postmortem 笔记（命名 `ieh-fix-*-postmortem.md`），并在 `industrial-engineering-hub.md` 索引里登记。
5. **小步提交，描述清楚**：每个独立修复/功能一个 commit，commit message 写明根因和解决方式；推送后确认 Vercel 构建通过。
6. **不破坏生产**：改数据库 schema 先本地 `npm run db:push` 验证；改构建/部署相关配置后必须本地 `npm run build` 通过再推送；环境变量改动同步到 Vercel（本地 .env 不会自动同步）。

Obsidian 项目笔记目录：`C:\Users\QuQu\Documents\ObsidianVault\03-Projects\industrial-engineering-hub\`


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
