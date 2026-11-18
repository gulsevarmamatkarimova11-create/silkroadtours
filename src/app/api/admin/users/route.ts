import { getDb } from "@/db/client";
import { createAdmin, listAdmins } from "@/db/queries/admin-users";
import { requireOwner } from "@/lib/auth/guard";
import { created, ok, parseBody, route } from "@/lib/http";
import { adminUserCreateSchema } from "@/validators/admin";

/** GET /api/admin/users — owners only. */
export const GET = route(async (req) => {
  await requireOwner(req);
  return ok(await listAdmins(getDb()));
});

/** POST /api/admin/users — owners create owner/editor accounts. */
export const POST = route(async (req) => {
  await requireOwner(req);
  const input = await parseBody(req, adminUserCreateSchema);
  return created({ id: await createAdmin(getDb(), input) });
});
