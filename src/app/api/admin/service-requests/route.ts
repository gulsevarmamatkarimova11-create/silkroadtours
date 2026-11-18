import { getDb } from "@/db/client";
import { listServiceRequests } from "@/db/queries/service-requests";
import { requireAdmin } from "@/lib/auth/guard";
import { ok, parseQuery, route } from "@/lib/http";
import { serviceRequestListQuerySchema } from "@/validators/admin";

/** GET /api/admin/service-requests?type&status&page */
export const GET = route(async (req) => {
  await requireAdmin(req);
  return ok(await listServiceRequests(getDb(), parseQuery(req, serviceRequestListQuerySchema)));
});
