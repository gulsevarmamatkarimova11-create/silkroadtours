# Silk Road Tours — booking platform

Next.js 15 on Cloudflare Workers (OpenNext) with a D1 database, for an inbound and domestic tour agency in Uzbekistan. The site is in English, Uzbek and Russian and shows prices in USD, UZS or EUR.

**Status:** Phases 1–2 (architecture, database, API, Telegram alerts, admin auth, seed data) are complete. The customer pages (Phase 3) and admin dashboard (Phase 4) come next. Read `docs/PHASE2_VERIFICATION.md` before relying on the build.

```bash
npm install
cp .dev.vars.example .dev.vars        # fill in secrets
npm run db:migrate:local && npm run db:seed:local
npm run typecheck
npm run preview                       # OpenNext build + local Workers runtime
```

- `docs/ARCHITECTURE.md`: stack, folder structure, data model, every API endpoint
- `docs/MANUAL_SETUP.md`: D1, secrets, Telegram bot, Turnstile, first admin, photos, content review
- `docs/PHASE2_VERIFICATION.md`: what was tested and what still has to be checked
