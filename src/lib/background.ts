import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Runs work after the response is sent (Workers `ctx.waitUntil`), so a slow Telegram API never
 * delays the customer's confirmation. Falls back to awaiting when no execution context exists.
 */
export async function runInBackground(task: Promise<unknown>): Promise<void> {
  const guarded = task.catch((err) => console.error("[background]", err));
  try {
    const { ctx } = getCloudflareContext();
    if (ctx && typeof ctx.waitUntil === "function") {
      ctx.waitUntil(guarded);
      return;
    }
  } catch {
    // No Cloudflare context (e.g. plain `next start`): fall through.
  }
  await guarded;
}
