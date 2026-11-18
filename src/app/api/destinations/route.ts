import { getDb } from "@/db/client";
import { listPublishedDestinations } from "@/db/queries/destinations";
import { ok, route } from "@/lib/http";

/** GET /api/destinations — directory with published tour counts and map coordinates. */
export const GET = route(async () => {
  return ok(await listPublishedDestinations(getDb()));
});
