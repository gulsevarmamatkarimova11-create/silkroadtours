# Silk Road Tours — booking platform

Next.js 15 on Cloudflare Workers (OpenNext) with a D1 database, for an inbound and domestic tour agency in Uzbekistan. The site is in English, Uzbek and Russian and shows prices in USD, UZS or EUR.

**Status:** Phases 1–2 (architecture, database, API, Telegram alerts, admin auth, seed data) are complete and ready for testing. The customer pages (Phase 3) and admin dashboard (Phase 4) come next.

## Start here
**Beginners: test everything in the browser with GitHub Codespaces. Follow `docs/CODESPACES_GUIDE.md`.**

```bash
npm run setup:codespace   # install, local secrets, local database + seed (automatic in Codespaces)
npm run test:unit         # unit tests
npm run typecheck         # TypeScript
npm run dev               # app on :3000
npm run test:smoke        # end-to-end checks against the running app
npm run preview           # Cloudflare Workers build on :8787
```

## Documents
- `docs/CODESPACES_GUIDE.md`: step-by-step testing for beginners
- `docs/ARCHITECTURE.md`: stack, folder structure, data model, every API endpoint
- `docs/MANUAL_SETUP.md`: D1, secrets, Telegram bot, Turnstile, first admin, photos, content review
- `docs/PHASE2_VERIFICATION.md`: what has been verified so far
