# V0.2 Deployment Guide

This document walks through wiring up the external services the V0.2 admin backend needs. If you only want to run the public site, no setup is required — `npm install && npm run build` works without any of the below.

---

## 1. Neon Serverless Postgres

1. Sign up at https://neon.tech (free tier).
2. Create a project. The default database is `neondb`.
3. In the project dashboard, copy the **pooled** connection string (it has `-pooler` in the host and `?pgbouncer=true` already appended). Use this for `DATABASE_URL`.
4. Optionally keep the direct connection string around for `prisma db push` / migrations (pooler can be flaky for DDL). Set it in a separate shell when running schema commands.

## 2. Admin password & HMAC secret

Run these once and paste the hex values into `.env.local`:

```bash
# Password hash (SHA-256)
node -e "console.log(require('crypto').createHash('sha256').update('your-password-here').digest('hex'))"

# Session HMAC secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The password is never stored; only its SHA-256 hash is compared with `crypto.timingSafeEqual`. Sessions are signed cookies (`sub=admin&exp=<ts>.<hmac>`) valid for 7 days.

## 3. Anthropic API key

1. https://console.anthropic.com → API Keys → Create key.
2. Models used:
   - `claude-sonnet-4-6-20250514` — writing, review, calc-writer
   - `claude-haiku-4-5-20251001` — keyword analysis
3. Cost budget per call (approximate, USD):
   - Keyword analysis (Haiku): ~$0.003
   - Full guide draft (Sonnet, 8K out): ~$0.08–0.15
   - Review (Sonnet): ~$0.03
   - Calculator draft (Sonnet, multi-attempt): ~$0.04–0.10

## 4. GitHub PAT (for publishing)

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.
2. Create a token for the `QuWenping/industrial-engineering-hub` repo with:
   - **Contents:** Read and write
3. Paste as `GITHUB_TOKEN`. The `GITHUB_REPO` value defaults to `QuWenping/industrial-engineering-hub`.
4. The publish route uses Octokit's low-level Git API (get-blob → create-blob → create-tree → create-commit → update-ref) so no local git working tree is needed.

## 5. Vercel Deploy Hook

1. Vercel dashboard → Your project → Settings → Git → Deploy Hooks.
2. Create a hook named "Admin publish" targeting the `main` branch.
3. Copy the URL into `VERCEL_DEPLOY_HOOK_URL`. After each publish commit, the admin fires this hook and Vercel re-deploys ~60–90s later.

## 6. Syncing schema to Neon

```bash
npx prisma generate          # generate @prisma/client
npm run db:push               # create/update tables (dev-friendly, no migration files)
npm run db:seed               # import content/calculators + guides + materials (idempotent)
```

For production schema changes, consider switching to `prisma migrate dev` to generate migration files. V0.2 uses `db push` because the schema is still evolving quickly.

## 7. Running locally

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin (login with your password)
- Prisma Studio: `npm run db:studio` → http://localhost:5555

## 8. Production (Vercel Hobby) considerations

- **Admin routes in production** will redirect to `/admin/login`, but AI calls will time out (10s function limit on Hobby). That's by design — the admin is a local tool, the public site is static.
- If you upgrade to Vercel Pro (60s limit) you can run shorter AI calls in production; Sonnet writing can still exceed 60s for long guides, so local remains recommended.
- The proxy (`src/proxy.ts`) blocks unauthenticated access to all `/admin/*` and `/api/admin/*` routes. It uses only HMAC (no DB round trip), so it's compatible with Edge runtimes and doesn't add latency.
- Set all the same env vars in Vercel (Project → Settings → Environment Variables) if you want production admin enabled. **Do not commit `.env.local`.**

## 9. Revoking access

Rotate `ADMIN_SECRET`: any existing session cookies immediately fail HMAC verification, forcing a logout. No session table to wipe.

## 10. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Cannot reach database server` from local | Neon enforces SSL; make sure `?sslmode=require` or the URL scheme uses `postgresql://` with Neon's default |
| Prisma says `datasource url` invalid | Prisma 7 moved URL to `prisma.config.ts`. Don't put it in `schema.prisma`. |
| AI writer produces `{"error": "ANTHROPIC_API_KEY is not set"}` | Key missing from `.env.local`; restart `next dev` after editing env |
| Publish 502 "GitHub commit failed" | Check PAT has `contents:write` on the right repo, and the repo matches `GITHUB_REPO` |
| Public site doesn't update after publish | Vercel deploy hook failed/empty — manually push main or check Vercel logs |
