// Bindings and variables available via getCloudflareContext().env.
// Keep in sync with wrangler.toml; `npm run cf-typegen` regenerates this file.

interface CloudflareEnv {
  // Bindings
  DB: D1Database;
  ASSETS: Fetcher;
  WORKER_SELF_REFERENCE: Fetcher;

  // [vars]
  SITE_URL: string;
  DEFAULT_CURRENCY: "USD" | "UZS" | "EUR";
  BOOKING_REF_PREFIX: string;

  // Secrets (wrangler secret put / .dev.vars)
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  /** 32+ random bytes, base64. Signs admin session cookies. */
  SESSION_SECRET: string;
  /** One-time secret that authorises creation of the first owner account. */
  ADMIN_SECRET: string;
  TURNSTILE_SECRET_KEY: string;
}
