/**
 * The site's query helper (docs/research/phase-2-sanity-studio-v6-and-astro.md: written here,
 * not exported by @sanity/astro). The datasets are private (enquiries and subscribers hold
 * personal data), so every read carries the Viewer token, server side only; without the token
 * every read answers null and the site renders Pending. The perspective cookie the preview
 * routes set switches a read to drafts (or the release stack the Studio asked for) with stega
 * and the source map for Visual Editing (the layout mounts the overlay). A page never throws because
 * Sanity did: a failed read logs and answers null, which is also what lets the dev server and CI
 * run against a placeholder project.
 */
import { getSecret } from 'astro:env/server';
import { sanityClient } from 'sanity:client';
import { stegaFilter } from '@oy/content/stega';
import type { ClientReturn, QueryParams } from '@sanity/client';
import type { AstroCookies } from 'astro';
import { PERSPECTIVE_COOKIE, type PreviewPerspective, perspectiveFromCookie } from './preview';

export interface LoadQueryOptions {
  cookies?: AstroCookies;
}

export interface LoadQueryResult<T> {
  data: T | null;
  perspective: PreviewPerspective;
  /** Whether drafts were read with the token. */
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

export async function loadQuery<const Q extends string>(
  query: Q,
  params: QueryParams = {},
  { cookies }: LoadQueryOptions = {},
): Promise<LoadQueryResult<ClientReturn<Q, unknown>>> {
  const wanted = perspectiveFromCookie(cookies?.get(PERSPECTIVE_COOKIE)?.value);
  const preview = wanted !== 'published' && Boolean(token);
  const perspective: PreviewPerspective = preview ? wanted : 'published';
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
    return { data: null, perspective: 'published', preview: false, error };
  }
}
