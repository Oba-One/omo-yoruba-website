/**
 * How a published document's tags reach the cache provider (ADR 0021): the type tag is purged
 * as a tag, since every page carries one per type it reads (`tagsForRoute`); a route tag is
 * purged as a path, which the Vercel provider maps to the path tag it attached itself. The
 * `route:` tags from `cacheTagsFor` are never attached to a page, so as tags they would purge
 * nothing.
 */
const ROUTE_TAG = 'route:';

export interface PurgePlan {
  tags: string[];
  paths: string[];
}

export function purgePlan(tags: string[]): PurgePlan {
  return {
    tags: tags.filter((tag) => !tag.startsWith(ROUTE_TAG)),
    paths: tags
      .filter((tag) => tag.startsWith(ROUTE_TAG))
      .map((tag) => tag.slice(ROUTE_TAG.length)),
  };
}
