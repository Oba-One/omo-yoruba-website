import { getSecret } from 'astro:env/server';
import { cacheTagsFor } from '@oy/content/routes';
import type { APIRoute } from 'astro';
import { SIGNATURE_HEADER, verifyWebhookSignature } from '../../lib/sanity/webhook';

export const prerender = false;

interface WebhookBody {
  _type?: string;
  slug?: string | null;
}

/**
 * The Sanity webhook target (wizard stage 7): projection `{_type, "slug": slug.current}`. Phase 2
 * verifies the signature and answers with the cache tags the document affects; Phase 4 purges
 * them through the Vercel cache provider (docs/adr/0001, docs/runbook.md).
 */
export const POST: APIRoute = async ({ request }) => {
  const secret = getSecret('SANITY_WEBHOOK_SECRET');
  if (!secret)
    return new Response('Webhook is not configured: SANITY_WEBHOOK_SECRET is missing.', {
      status: 500,
    });
  const body = await request.text();
  if (!(await verifyWebhookSignature(body, request.headers.get(SIGNATURE_HEADER), secret))) {
    return new Response('Invalid signature', { status: 401 });
  }
  let payload: WebhookBody;
  try {
    payload = JSON.parse(body) as WebhookBody;
  } catch {
    return new Response('Body is not JSON', { status: 400 });
  }
  if (!payload._type) return new Response('Body has no _type', { status: 400 });
  const tags = cacheTagsFor(payload._type, payload.slug ?? undefined);
  console.info(
    '[revalidate]',
    JSON.stringify({ type: payload._type, slug: payload.slug ?? null, tags, purged: false }),
  );
  return new Response(
    JSON.stringify({
      type: payload._type,
      tags,
      purged: false,
      note: 'Cache purge arrives in Phase 4.',
    }),
    {
      status: 200,
      headers: { 'content-type': 'application/json' },
    },
  );
};

export const ALL: APIRoute = () =>
  new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
