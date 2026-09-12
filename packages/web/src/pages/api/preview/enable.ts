import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } from 'astro:env/client';
import { getSecret } from 'astro:env/server';
import { STUDIO_API_VERSION } from '@oy/content';
import { createClient } from '@sanity/client';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import type { APIRoute } from 'astro';
import { PERSPECTIVE_COOKIE, previewCookieOptions } from '../../../lib/sanity/preview';

export const prerender = false;

/** The Presentation tool opens this with its secret; a valid one turns draft mode on and redirects. */
export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const token = getSecret('SANITY_API_READ_TOKEN');
  if (!token) {
    return new Response(
      'Preview is not configured: SANITY_API_READ_TOKEN is missing (docs/runbook.md).',
      {
        status: 500,
      },
    );
  }
  const client = createClient({
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: PUBLIC_SANITY_DATASET,
    apiVersion: STUDIO_API_VERSION,
    useCdn: false,
    token,
  });
  const { isValid, redirectTo, studioPreviewPerspective } = await validatePreviewUrl(
    client,
    request.url,
  );
  if (!isValid) return new Response('Invalid secret', { status: 401 });
  cookies.set(
    PERSPECTIVE_COOKIE,
    studioPreviewPerspective ?? 'drafts',
    previewCookieOptions(request),
  );
  return redirect(redirectTo ?? '/', 307);
};
