# Progress log

Working branch: `mvp`. Every phase ends with the quality gates in the table below.

| Gate | Command |
|---|---|
| Types | `npm run typecheck` |
| Unit tests | `npm run test:unit` |
| Schema parity | `npm run db:check` |
| Smoke (dev) | `npm run dev` + `npm run test:smoke` |
| Smoke (Workers build) | `npm run preview` + `BASE_URL=http://localhost:8787 npm run test:smoke` |
| CI | GitHub Actions "Test" workflow |

---

## Phase 0 — verify the base (2026-11-18)

### What was fixed
| Problem | Fix | Why this fix |
|---|---|---|
| `npm install` failed: the current `@opennextjs/cloudflare` (1.20.x) needs `next >= 15.5.29`; the project pinned `next 15.5.2`. | `next` → `15.5.29` (latest Next 15 patch), `react`/`react-dom` → `19.1.10` (latest 19.1 patch), `wrangler` → `^4.164`, `@cloudflare/workers-types` → `^5.20261117`. | Same major versions, same architecture. 15.5.2 and 19.1.1 also predate the December 2025 React Server Components security fixes. |
| `drizzle-orm < 0.45.2` has a high-severity advisory (identifier escaping). | `drizzle-orm` → `^0.45.4`. | The project never builds identifiers from user input, but the upgrade is free (typecheck and tests pass unchanged). |
| No `package-lock.json` in the repo. | Committed the lockfile. | CI uses `npm ci` and installs become reproducible. |
| Server-side Turnstile checks failed in restricted networks (this sandbox cannot reach `challenges.cloudflare.com`). | `verifyTurnstile()` now answers Cloudflare's **documented test secret keys** (`1x…AA` pass, `2x…AA` fail, `3x…AA` spent) locally, without a network call. A unit test proves real secrets still go to Cloudflare. | Test keys always return a fixed answer by design, so behaviour is identical; tests no longer depend on an external service. Production uses a real secret, which is never in that list. |

### Remaining audit notes (accepted)
`npm audit` still lists moderate/high advisories in **build-time tooling only**: `postcss` bundled inside `next` (CSS build step) and `glob`/`minimatch` inside the OpenNext CLI. None of these run in the deployed Worker. They clear when Next/OpenNext ship patched dependencies; forcing them now would downgrade OpenNext to 0.3 or jump to Next 16 (an architecture change).

### Results
| Gate | Result |
|---|---|
| `typecheck` | ✅ 0 errors |
| `test:unit` | ✅ 24 passed |
| `db:check` | ✅ 15 tables, 179 columns, 28 indexes, 13 CHECKs |
| Smoke vs `next dev` | ✅ 28 passed, 0 failed, 1 skipped (Telegram — no bot configured locally) |
| Smoke vs `opennextjs-cloudflare preview` (Workers runtime) | ✅ 28 passed, 0 failed, 1 skipped |

### Worker size (API only, before any pages)
`wrangler deploy --dry-run`: **5,080.79 KiB raw / 972.34 KiB gzip**. The limit that matters is the compressed size: Workers Free = 3 MiB, Workers Paid = 10 MiB.
