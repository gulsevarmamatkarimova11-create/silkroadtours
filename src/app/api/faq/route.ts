import { getDb } from "@/db/client";
import { listFaq } from "@/db/queries/faq";
import { ok, parseQuery, route } from "@/lib/http";
import { faqQuerySchema } from "@/validators/public";

/** GET /api/faq?category= — travel guide entries. */
export const GET = route(async (req) => {
  const { category } = parseQuery(req, faqQuerySchema);
  return ok(await listFaq(getDb(), { category }));
});
