import { getDb } from "@/db/client";
import { getTourBaseCurrency, replacePricing } from "@/db/queries/tours";
import { requireAdmin } from "@/lib/auth/guard";
import { ok, parseBody, parseId, route } from "@/lib/http";
import { pricingReplaceSchema } from "@/validators/admin";

/**
 * PUT /api/admin/tours/[id]/pricing — atomically replace price tiers.
 * Each tier needs a price in the tour's base currency; other currencies are optional overrides.
 */
export const PUT = route<{ id: string }>(async (req, { id }) => {
  await requireAdmin(req);
  const db = getDb();
  const tourId = parseId(id);
  const base = await getTourBaseCurrency(db, tourId);
  const tiers = await parseBody(req, pricingReplaceSchema(base));
  await replacePricing(db, tourId, base, tiers);
  return ok({ tiers: tiers.length, baseCurrency: base });
});
