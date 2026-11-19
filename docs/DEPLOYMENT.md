# Deploying Silk Road Tours to Cloudflare

This guide takes you from "the code is on GitHub" to "the website is live on my domain". Do the steps in order; each one says exactly where to click. It takes about an hour the first time.

**Rules for secrets.** Passwords, tokens and keys go **only** into Cloudflare or GitHub settings pages. Never paste them into a chat, an email or a file in the repository.

You need:
- the GitHub repository (you have it),
- an email address for a Cloudflare account,
- a bank card for the Cloudflare Workers Paid plan ($5 per month, see step 2),
- your domain name, if you have one (you can also start on a free `*.workers.dev` address).

---

## Step 1 — Create a Cloudflare account

1. Open **https://dash.cloudflare.com/sign-up** and sign up with your email.
2. Confirm your email from the message Cloudflare sends.
3. Sign in. You see the Cloudflare **dashboard**.

## Step 2 — Choose the Workers plan

**Recommendation: Workers Paid, $5 per month.** Here is the honest reasoning:

| Limit | Workers Free | Workers Paid | This website |
|---|---|---|---|
| Compressed Worker size | 3 MiB | 10 MiB | **1.80 MiB** (measured: 9,543 KiB raw / 1,847 KiB gzip) — fits both |
| CPU time per request | **10 ms** | 30 s (default) | Rendering a page with React, and checking an admin password (PBKDF2, 100,000 rounds), regularly need **more than 10 ms** |
| Requests | 100,000 per day | 10 million per month included | Plenty either way |

The code is small enough for the Free plan, but the Free plan's 10 ms CPU limit would make pages and admin sign-in fail with "Error 1102" under normal use. The Paid plan removes that risk.

1. In the left menu click **Workers & Pages** → **Plans** (or **Compute (Workers)** → **Workers plans**).
2. Under **Workers Paid** click **Purchase** and add your card.

D1 (the database) is included. The free D1 allowance (5 GB storage, 5 million reads per day) is far more than this site needs.

## Step 3 — Create the API token and give it to GitHub

GitHub needs permission to deploy to your Cloudflare account. You give it a **token** with only the permissions it needs.

**3a. Find your Account ID**
1. In the Cloudflare dashboard click **Workers & Pages**.
2. On the right side you see **Account ID**. Click the copy icon. Keep this page open.

**3b. Create the token**
1. Click your profile icon (top right) → **My Profile** → **API Tokens** → **Create Token**.
2. Next to **Create Custom Token**, click **Get started**.
3. **Token name:** `GitHub deploy – Silk Road Tours`.
4. **Permissions** — add exactly these three rows (use **+ Add more** for each):
   | First box | Second box | Third box |
   |---|---|---|
   | Account | **Workers Scripts** | **Edit** |
   | Account | **D1** | **Edit** |
   | Account | **Account Settings** | **Read** |
5. **Account Resources:** Include → your account.
6. Click **Continue to summary** → **Create Token**.
7. Click **Copy**. The token is shown only once.

**3c. Store both values in GitHub**
1. Open your repository on github.com → **Settings** (top menu) → **Secrets and variables** → **Actions**.
2. On the **Secrets** tab click **New repository secret**:
   - Name: `CLOUDFLARE_API_TOKEN`, Secret: paste the token → **Add secret**.
3. Click **New repository secret** again:
   - Name: `CLOUDFLARE_ACCOUNT_ID`, Secret: paste the Account ID → **Add secret**.

## Step 4 — Create the database

1. Cloudflare dashboard → **Storage & Databases** → **D1 SQL Database** → **Create database**.
2. Name: `silkroad-tours-db` (exactly this). Location: **Automatic** (or Eastern Europe). Click **Create**.
3. On the database page, copy the **Database ID** (a long code like `a1b2c3d4-…`).
4. On github.com open the file **`wrangler.toml`** in your repository → click the **pencil** (Edit) icon.
5. Find the line `database_id = "REPLACE_WITH_OUTPUT_OF_wrangler_d1_create"` and replace the text between the quotes with your Database ID.
6. Click **Commit changes…** → **Commit changes**.

> The tables are created automatically by the deploy workflow (step 7). You don't run any SQL by hand.

*(Command-line alternative: `npx wrangler d1 create silkroad-tours-db` prints the same `database_id`.)*

## Step 5 — Turnstile (spam protection for the forms)

1. Cloudflare dashboard → **Turnstile** → **Add widget**.
2. **Widget name:** `Silk Road Tours`. **Hostnames:** add your domain (e.g. `silkroadtours.uz`) **and** `silkroad-tours.<your-subdomain>.workers.dev` (you'll see the exact workers.dev name after step 7; you can come back and add it).
3. **Widget mode:** Managed. Click **Create**.
4. You get a **Site Key** and a **Secret Key**.
   - **Site Key** → GitHub → Settings → Secrets and variables → Actions → **Variables** tab → **New repository variable**: Name `TURNSTILE_SITE_KEY`, Value: the site key.
   - **Secret Key** → keep this page open; you add it to Cloudflare in step 8.

## Step 6 — Tell the site its address

GitHub → Settings → Secrets and variables → Actions → **Variables** tab → **New repository variable**:
- Name: `SITE_URL`
- Value: your full address **without a trailing slash**, e.g. `https://silkroadtours.uz`.
  If you don't have a domain yet, use `https://silkroad-tours.<your-subdomain>.workers.dev` (Cloudflare shows your subdomain under **Workers & Pages** → **Account details** → **Subdomain**). Change it later in step 11.

## Step 7 — Run the first deploy

1. github.com → your repository → **Actions** tab → **Deploy** (left list) → **Run workflow** (right).
2. Tick **"First deploy only: load the 9 destinations, 18 tours and FAQ…"**.
3. Click the green **Run workflow** button.
4. Wait 3–5 minutes. A green tick means the site is live. A red cross: click the run and read the first red message — it says exactly what is missing (for example "repository secret CLOUDFLARE_API_TOKEN").

After this, **every push to `main` deploys automatically**, but only after the **Test** workflow has passed. Never tick "seed" again; it only works on an empty database and refuses to run otherwise.

## Step 8 — Add the runtime secrets

The website needs five secrets. You add them in Cloudflare, where nobody else can read them.

1. **Generate two random secrets.** Open any terminal (for example your GitHub Codespace: Code → Codespaces → open, then the Terminal panel) and run this twice; copy each result:
   ```bash
   openssl rand -base64 32
   ```
2. Cloudflare dashboard → **Workers & Pages** → **silkroad-tours** → **Settings** → **Variables and Secrets** → **+ Add**.
3. For each row below choose **Type: Secret**, enter the name and value, then **Deploy**:

   | Name | Value |
   |---|---|
   | `SESSION_SECRET` | the first random value |
   | `ADMIN_SECRET` | the second random value (you'll use it once in step 9) |
   | `TURNSTILE_SECRET_KEY` | the Turnstile **Secret Key** from step 5 |
   | `TELEGRAM_BOT_TOKEN` | the bot token from @BotFather (see `docs/MANUAL_SETUP.md` §3) |
   | `TELEGRAM_CHAT_ID` | the chat id of your bookings group (negative number, e.g. `-1001234567890`) |

*(Command-line alternative, run in a terminal where `CLOUDFLARE_API_TOKEN` is set: `npx wrangler secret put SESSION_SECRET` and so on — it asks for the value, so it never appears on screen or in history.)*

## Step 9 — Create your admin account (once)

In a terminal, run this command after replacing the four CAPITALISED parts. Use your own strong password (at least 12 characters):

```bash
curl -X POST https://YOUR-SITE/api/admin/auth/bootstrap -H "content-type: application/json" -H "x-admin-secret: YOUR_ADMIN_SECRET" -d '{"email":"YOU@EXAMPLE.COM","name":"YOUR NAME","password":"YOUR-STRONG-PASSWORD"}'
```

- `{"data":{"id":1,…,"role":"owner"}}` → done. Open `https://YOUR-SITE/admin` and sign in.
- `already_bootstrapped` → an admin exists already; sign in instead.
- `invalid_admin_secret` → the `x-admin-secret` value doesn't match step 8.

This call works only while there are no admins, so it can't be used again by anyone. Add staff later in **Admin → Sozlamalar (Settings) → Adminlar**.

## Step 10 — First things to do in the admin panel

1. **Sozlamalar (Settings) → Aloqa maʼlumotlari (Contact details):** phone, email, WhatsApp number, Telegram username, address, licence number → **Saqlash**. Empty fields stay hidden on the website; the WhatsApp/Telegram buttons appear as soon as you fill them in.
2. **Settings → Valyuta kurslari:** click **Markaziy bankdan yangilash** (Refresh from Central Bank).
3. **Settings → Telegram:** click **Telegramga sinov xabari**. A test message must appear in your bookings group.
4. Make a test booking on the website and check that it appears in Telegram and in **Bronlar** (Bookings). Then set it to **Bekor qilingan** (Cancelled).

## Step 11 — Connect your own domain

Your domain must use Cloudflare DNS (Cloudflare dashboard → **Add a domain**, then change the nameservers at your registrar as Cloudflare instructs; this can take a few hours).

1. **Workers & Pages** → **silkroad-tours** → **Settings** → **Domains & Routes** → **+ Add** → **Custom domain**.
2. Enter `silkroadtours.uz` (and, if you want, add `www.silkroadtours.uz` as a second custom domain). Click **Add domain**. Cloudflare creates the DNS record and the HTTPS certificate.
3. Update GitHub → Settings → Secrets and variables → Actions → Variables → **`SITE_URL`** to `https://silkroadtours.uz`.
4. Make sure the domain is in the Turnstile widget's **Hostnames** (step 5).
5. Run **Actions → Deploy → Run workflow** once more (without "seed") so the new address is used in links, the sitemap and Telegram messages.

## Step 12 — Before you announce the site

Work through **`docs/GO_LIVE_CHECKLIST.md`** (real prices, photos, Search Console, analytics, backups).

---

## Rolling back

**Website code** (a deploy broke something):
1. Cloudflare dashboard → **Workers & Pages** → **silkroad-tours** → **Deployments**.
2. Find the last version that worked → **⋯** → **Rollback** (or **Deploy**). It is live within seconds.
3. Fix the problem in the code; the next successful push deploys again.

*(Command line: `npx wrangler rollback`.)*

**Database** (data was deleted or changed by mistake): D1 keeps a 30-day history ("Time Travel").
```bash
npx wrangler d1 time-travel info silkroad-tours-db
npx wrangler d1 time-travel restore silkroad-tours-db --timestamp=2026-12-01T10:00:00Z
```
Restoring replaces the whole database with its state at that time, so new bookings after that moment are lost; export first (see the backup routine in the checklist).

## When something goes wrong

| What you see | What to do |
|---|---|
| Deploy run fails at "Check that deployment is configured" | Read the message: it lists exactly which secret, variable or `database_id` is missing. |
| Forms say "The security check failed" | `TURNSTILE_SECRET_KEY` (step 8) and `TURNSTILE_SITE_KEY` (step 5) must come from the **same** widget, and your domain must be in its Hostnames. |
| Bookings arrive but no Telegram message | Settings → Telegram test. If it fails, re-check `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` and that the bot is in the group. Resend from the booking page. |
| `https://YOUR-SITE/api/health` shows `"database":{"tours":0}` | The catalogue was not loaded: run Deploy with "seed" ticked (only works on an empty database). |
| Error 1102 (CPU limit) | You are on Workers Free; switch to Workers Paid (step 2). |
