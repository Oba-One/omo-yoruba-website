/**
 * Verifies a Sanity GROQ-powered webhook: the `sanity-webhook-signature` header carries
 * `t=<timestamp>,v1=<base64url HMAC-SHA256 of "<timestamp>.<body>">` signed with the secret
 * the wizard stores as SANITY_WEBHOOK_SECRET. Web Crypto only, so the route runs anywhere.
 */
export const SIGNATURE_HEADER = 'sanity-webhook-signature';
const TOLERANCE_MS = 5 * 60 * 1000;

function base64url(bytes: ArrayBuffer): string {
  let binary = '';
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyWebhookSignature(
  body: string,
  header: string | null,
  secret: string,
  now: number = Date.now(),
): Promise<boolean> {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(
    header.split(',').map((part) => part.split('=') as [string, string]),
  );
  const timestamp = Number(parts.t);
  const signature = parts.v1;
  if (!Number.isFinite(timestamp) || !signature) return false;
  if (Math.abs(now - timestamp) > TOLERANCE_MS) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${timestamp}.${body}`),
  );
  return timingSafeEqual(base64url(digest), signature);
}
