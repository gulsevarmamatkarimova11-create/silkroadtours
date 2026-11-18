import { getDb } from "@/db/client";
import { getRates } from "@/db/queries/settings";
import { getPublishedTourBySlug, priceTable, relatedTours } from "@/db/queries/tours";
import { notFound, ok, parseQuery, route } from "@/lib/http";
import { currencyQuerySchema } from "@/validators/public";

/** GET /api/tours/[slug]?currency= — full tour with itinerary, price table, upcoming departures, related tours. */
export const GET = route<{ slug: string }>(async (req, { slug }) => {
  const { currency } = parseQuery(req, currencyQuerySchema);
  const db = getDb();
  const [tour, rates] = await Promise.all([getPublishedTourBySlug(db, slug), getRates(db)]);
  if (!tour) throw notFound("tour_not_found");
  const related = await relatedTours(db, tour.id, tour.primaryDestinationId);
  return ok({
    tour,
    pricing: priceTable(tour, currency, rates),
    currency,
    related,
    ratesUpdatedAt: rates.updatedAt,
  });
});
