import { getDb } from "@/db/client";
import { listBookings } from "@/db/queries/bookings";
import { requireAdmin } from "@/lib/auth/guard";
import { ok, parseQuery, route } from "@/lib/http";
import { bookingListQuerySchema } from "@/validators/admin";

/** GET /api/admin/bookings?status&audience&q&from&to&page&pageSize */
export const GET = route(async (req) => {
  await requireAdmin(req);
  return ok(await listBookings(getDb(), parseQuery(req, bookingListQuerySchema)));
});
