// Cloudflare Turnstile server-side verification.
// Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult = { ok: true } | { ok: false; codes: string[] };

export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp?: string | null,
  fetchImpl: typeof fetch = fetch,
): Promise<TurnstileResult> {
  if (!secret) return { ok: false, codes: ["missing-input-secret"] };
  if (!token || token.length > 2048) return { ok: false, codes: ["invalid-input-response"] };

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (remoteIp) form.append("remoteip", remoteIp);

  try {
    const res = await fetchImpl(VERIFY_URL, { method: "POST", body: form });
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    return data.success ? { ok: true } : { ok: false, codes: data["error-codes"] ?? ["unknown"] };
  } catch (err) {
    return { ok: false, codes: [`network-error:${err instanceof Error ? err.message : String(err)}`] };
  }
}
