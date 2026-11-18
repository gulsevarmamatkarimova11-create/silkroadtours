import { getDb } from "@/db/client";
import { createDeparture } from "@/db/queries/tours";
import { requireAdmin } from "@/lib/auth/guard";
import { created, parseBody, parseId, route } from "@/lib/http";
import { departureUpsertSchema } from "@/validators/admin";

/** POST /api/admin/tours/[id]/departures — add an available date. */
export const POST = route<{ id: string }>(async (req, { id }) => {
  await requireAdmin(req);
  const input = await parseBody(req, departureUpsertSchema);
  return created({ id: await createDeparture(getDb(), parseId(id), input) });
});
