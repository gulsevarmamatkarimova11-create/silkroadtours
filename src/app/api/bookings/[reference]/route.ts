import { getDb } from "@/db/client";
import { getBookingPublic } from "@/db/queries/bookings";
import { notFound, ok, route } from "@/lib/http";
import { isValidReference } from "@/lib/reference";

/** GET /api/bookings/[reference] — confirmation page data (no personal details). */
export const GET = route<{ reference: string }>(async (_req, { reference }) => {
  const ref = reference.toUpperCase();
  if (!isValidReference(ref)) throw notFound("booking_not_found");
  const booking = await getBookingPublic(getDb(), ref);
  if (!booking) throw notFound("booking_not_found");
  return ok(booking, { headers: { "cache-control": "no-store" } });
});
