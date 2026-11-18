import { requireAdmin } from "@/lib/auth/guard";
import { ok, route } from "@/lib/http";

/** GET /api/admin/auth/me — the signed-in admin, or 401. */
export const GET = route(async (req) => ok(await requireAdmin(req)));
