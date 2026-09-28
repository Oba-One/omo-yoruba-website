/**
 * The site's query helper (docs/research/phase-2-sanity-studio-v6-and-astro.md: written here,
 * not exported by @sanity/astro). The datasets are private (enquiries and subscribers hold
 * personal data), so every read carries the Viewer token, server side only; without the token
 * every read answers null and the site renders Pending. The perspective cookie the preview
 * routes set switches a read to drafts (or the release stack the Studio asked for) with stega
 * and the source map for Visual Editing (the layout mounts the overlay), but only beside the
 * session cookie the same route signed (`draft-session.ts`): anyone can set the perspective
 * cookie by hand, and without the session it reads as published. A page never throws because
 * Sanity did: a failed read logs and answers null, which is also what lets the dev server and CI
 * run against a placeholder project.
 */
import { getSecret } from 'astro:env/server';
import { sanityClient } from 'sanity:client';
import { stegaFilter } from '@oy/content/stega';
import type { ClientReturn, QueryParams } from '@sanity/client';
import type { AstroCookies } from 'astro';
import { previewPerspective } from './draft-session';
import { DRAFT_SESSION_COOKIE, PERSPECTIVE_COOKIE, type PreviewPerspective } from './preview';

export interface LoadQueryOptions {
  cookies?: AstroCookies;
}

export interface LoadQueryResult<T> {
  data: T | null;
  /** The perspective the request reads: published unless its draft session verifies. */
  perspective: PreviewPerspective;
  /** Whether the request is in draft mode, so drafts were read (or would have been, had the read not failed). */
  preview: boolean;
  error?: unknown;
}

// The Viewer token for the private dataset, and one retry rather than the client's five so a
// placeholder project fails fast instead of stalling a page. The stega filter keeps the keys the
// site branches on clean whenever a read encodes (docs/research/phase-4-sanity-visual-editing.md).
// This module is server only.
const token = getSecret('SANITY_API_READ_TOKEN');
const client = sanityClient.withConfig({
  maxRetries: 1,
  useCdn: false,
  stega: { filter: stegaFilter },
  ...(token ? { token } : {}),
});

// One answer per request: the page's read and the layout's run apart, and an answer taken for each
// could split a request across the session's expiry, or leave the layout on published when only its
// own read failed, mounting the router beside a draft page (ADR 0041). Astro hands every component
// of one render the same cookies object, so it keys the answer.
const decided = new WeakMap<AstroCookies, PreviewPerspective>();

function requestPerspective(cookies: AstroCookies | undefined): PreviewPerspective {
  if (!cookies) return 'published';
  let perspective = decided.get(cookies);
  if (perspective === undefined) {
    perspective = previewPerspective(
      {
        perspective: cookies.get(PERSPECTIVE_COOKIE)?.value,
        session: cookies.get(DRAFT_SESSION_COOKIE)?.value,
      },
      token,
      Date.now(),
    );
    decided.set(cookies, perspective);
  }
  return perspective;
}

export async function loadQuery<const Q extends string>(
  query: Q,
  params: QueryParams = {},
  { cookies }: LoadQueryOptions = {},
): Promise<LoadQueryResult<ClientReturn<Q, unknown>>> {
  const perspective = requestPerspective(cookies);
  const preview = perspective !== 'published';
  try {
    const data = await client.fetch(
      query,
      params,
      preview
        ? { perspective, stega: true, resultSourceMap: 'withKeyArraySelector' }
        : { perspective: 'published' },
    );
    return { data: data as ClientReturn<Q, unknown>, perspective, preview };
  } catch (error) {
    console.error(
      '[loadQuery]',
      JSON.stringify({
        query: query.slice(0, 80),
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    return { data: null, perspective, preview, error };
  }
}
