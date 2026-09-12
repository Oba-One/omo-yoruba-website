import { getSecret } from 'astro:env/server';
import { cacheTagsFor } from '@oy/content/routes';
import type { APIRoute } from 'astro';
import { purgePlan } from '../../lib/sanity/purge';
import { SIGNATURE_HEADER, verifyWebhookSignature } from '../../lib/sanity/webhook';

export const prerender = false;

interface WebhookBody {
  _type?: string;
  slug?: string | null;
}

/**
 * The Sanity webhook target (wizard stage 7): projection `{_type, "slug": slug.current}`. Verifies
 * the signature, turns the document into the tags it affects (`cacheTagsFor`) and purges them
 * through the cache provider (ADR 0021): the type tag reaches every page that carries it, and
 * each route tag is purged as a path, which the Vercel provider maps to the path tag it attached
 * itself. The answer lists what was purged; a failed purge answers 500 with the reason, so the
 * webhook's delivery log shows it.
 */
export const POST: APIRoute = async ({ request, cache }) => {
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
  const plan = purgePlan(tags);
  const answer = (status: number, extra: Record<string, unknown>) =>
    new Response(
      JSON.stringify({ type: payload._type, slug: payload.slug ?? null, tags, ...extra }),
      {
        status,
        headers: { 'content-type': 'application/json' },
      },
    );
  if (tags.length === 0) {
    console.info('[revalidate]', JSON.stringify({ type: payload._type, tags, purged: false }));
    return answer(200, { purged: false, note: 'This type is never shown on the site.' });
  }
  try {
    if (plan.tags.length > 0) await cache.invalidate({ tags: plan.tags });
    for (const path of plan.paths) await cache.invalidate({ path });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      '[revalidate]',
      JSON.stringify({ type: payload._type, tags, purged: false, message }),
    );
    return answer(500, { purged: false, error: message });
  }
  console.info(
    '[revalidate]',
    JSON.stringify({ type: payload._type, slug: payload.slug ?? null, tags, purged: true }),
  );
  return answer(200, { purged: true, paths: plan.paths });
};

export const ALL: APIRoute = () =>
  new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
