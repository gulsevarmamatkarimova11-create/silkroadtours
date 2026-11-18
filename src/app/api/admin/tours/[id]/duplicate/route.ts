import { getDb } from "@/db/client";
import { duplicateTour } from "@/db/queries/tours";
import { requireAdmin } from "@/lib/auth/guard";
import { created, parseId, route } from "@/lib/http";

/** POST /api/admin/tours/[id]/duplicate — copy as an unpublished draft (slug "<slug>-copy"). */
export const POST = route<{ id: string }>(async (req, { id }) => {
  await requireAdmin(req);
  return created({ id: await duplicateTour(getDb(), parseId(id)) });
});
