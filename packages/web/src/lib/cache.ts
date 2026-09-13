/**
 * Route caching (ADR 0001, ADR 0021): every public page answers with the Vercel CDN headers for
 * one day fresh and seven days stale-while-revalidate (ROUTES section 1), tagged with one
 * `type:` tag per document type that reaches the route (`tagsForRoute`), so a publish purges by
 * type through `/api/revalidate` and the provider adds the path tag itself. A draft-mode request
 * (the perspective cookie) opts out here and again in the middleware after the render, since a
 * later `cache.set()` would switch the cache back on; so does a render whose Sanity read failed,
 * which would otherwise keep an all-Pending page on the CDN for a day. The layout opts a form error
 * re-render and a failed settings read out itself. In dev the cache object is a no-op.
 */
import { type PublicRoute, tagsForRoute } from '@oy/content/routes';
import type { AstroGlobal } from 'astro';

export const PAGE_MAX_AGE = 60 * 60 * 24;
export const PAGE_SWR = 60 * 60 * 24 * 7;

export interface CachePageOptions {
  /** Draft mode: never cache. */
  draft: boolean;
  /** The page's Sanity read failed (`loadQuery`'s `error`): never cache the Pending fallback. */
  failed?: boolean;
}

export type CacheLike = Pick<AstroGlobal['cache'], 'set'>;

export function cacheOptions(route: PublicRoute) {
  return { maxAge: PAGE_MAX_AGE, swr: PAGE_SWR, tags: tagsForRoute(route) };
}

export function cachePage(
  astro: { cache: CacheLike },
  route: PublicRoute,
  { draft, failed = false }: CachePageOptions,
): void {
  if (draft || failed) {
    astro.cache.set(false);
    return;
  }
  astro.cache.set(cacheOptions(route));
}
