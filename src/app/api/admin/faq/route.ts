import { getDb } from "@/db/client";
import { createFaq, listFaq } from "@/db/queries/faq";
import { requireAdmin } from "@/lib/auth/guard";
import { created, ok, parseBody, route } from "@/lib/http";
import { faqUpsertSchema } from "@/validators/admin";

export const GET = route(async (req) => {
  await requireAdmin(req);
  return ok(await listFaq(getDb(), { includeUnpublished: true }));
});

export const POST = route(async (req) => {
  await requireAdmin(req);
  const input = await parseBody(req, faqUpsertSchema);
  return created({ id: await createFaq(getDb(), input) });
});
