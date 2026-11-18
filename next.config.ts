import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // The Workers runtime has no built-in Next image optimizer. Media is served
    // from absolute URLs (R2 / Cloudflare Images / CDN) that are already sized.
    unoptimized: true,
  },
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);

// Exposes D1 + secrets from wrangler.toml / .dev.vars to `next dev`
// through getCloudflareContext().
initOpenNextCloudflareForDev();
