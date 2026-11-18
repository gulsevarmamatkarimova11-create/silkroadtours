import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default config: no incremental cache binding yet. Pages that read from D1 are
// rendered dynamically; add an R2/KV incremental cache here if ISR is needed later.
export default defineCloudflareConfig({});
