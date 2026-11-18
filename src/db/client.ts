import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

export type Db = DrizzleD1Database<typeof schema>;

/** For route handlers, server actions and dynamically rendered server components. */
export function getDb(): Db {
  const { env } = getCloudflareContext();
  return drizzle(env.DB, { schema });
}

/** For code that may run during static generation (generateStaticParams, sitemap). */
export async function getDbAsync(): Promise<Db> {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema });
}

export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env;
}
