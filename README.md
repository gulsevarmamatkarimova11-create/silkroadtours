# Silk Road Tours — booking platform

Website and admin panel for a tour agency in Jizzakh, Uzbekistan, serving international travellers and residents of Uzbekistan. Next.js 15 on Cloudflare Workers (OpenNext) with a D1 database. The site is in English, Uzbek and Russian and shows live prices in USD, UZS or EUR; the admin panel is in Uzbek (default) and English.

**Status:** MVP complete and deploy-ready (not deployed). See `docs/PROGRESS.md` for test results and `docs/DEPLOYMENT.md` to go live.

## Start here
- **Testing in the browser (beginners):** `docs/CODESPACES_GUIDE.md`
- **See it online without deploying:** GitHub → Actions → **Preview (test link)** → Run workflow. A temporary `https://….trycloudflare.com` link appears in a new issue and stays online for the chosen minutes (demo data, nothing is created in Cloudflare). Admin: `admin@silkroad.test` with the password stored in the repository secret `PREVIEW_ADMIN_PASSWORD` (the repository is public, so the password never appears in logs or issues).
- **Going live:** `docs/DEPLOYMENT.md`, then `docs/GO_LIVE_CHECKLIST.md`

```bash
npm run setup:codespace   # install, local secrets, local database + seed (automatic in Codespaces)
npm run dev               # site on :3000  (/en, /uz, /ru; admin at /admin)
npm run test:unit         # unit tests
npm run typecheck         # TypeScript
npm run db:check          # migrations ↔ schema.ts
npm run test:smoke        # API end-to-end checks against the running app
npm run preview           # Cloudflare Workers build on :8787
npm run test:e2e          # Playwright e2e + accessibility (against :8787)
```

## Documents
| File | What it covers |
|---|---|
| `docs/ARCHITECTURE.md` | Stack, folders, data model, every API endpoint |
| `docs/design/DESIGN_SYSTEM.md` | The "Modern Silk Road" design system: palette, type, ornaments, motion, performance budget |
| `docs/design/COMPETITOR_ANALYSIS.md` | 13 competitor and benchmark sites compared |
| `docs/DEPLOYMENT.md` | Click-by-click deployment to Cloudflare |
| `docs/GO_LIVE_CHECKLIST.md` | Content, security, SEO, analytics and backups before launch |
| `docs/MANUAL_SETUP.md` | Telegram bot, photos, content review, schema changes |
| `docs/PROGRESS.md` | What was built, test results, decisions, open items |
| `docs/CODESPACES_GUIDE.md` | Testing everything in a browser-based Codespace |
