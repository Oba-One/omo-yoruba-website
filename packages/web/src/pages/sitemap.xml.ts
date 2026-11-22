/**
 * The sitemap (ADR 0060): the site's pages and every album page the gallery lists, each on the public host.
 * A photo address, the Studio, the API, the 404 page and the member guide are never listed. The album slugs
 * come from Sanity on each request, since the site renders on the server and has no build-time list; the
 * answer is never cached, which a crawler asking now and then can afford. A failed read answers 503, so a
 * crawler comes back rather than dropping the albums.
 */
import { sitemapQuery } from '@oy/content/queries';
import { albumHref, SITEMAP_ROUTES } from '@oy/content/routes';
import type { APIRoute } from 'astro';
import { albumsHeld } from '../lib/sanity/gallery-page';
import { loadQuery } from '../lib/sanity/load-query';
import { cleanText } from '../lib/sanity/view';
import { sitemapXml } from '../lib/seo';

export const prerender = false;

export const GET: APIRoute = async () => {
  const { data, error } = await loadQuery(sitemapQuery);
  if (error) {
    return new Response('The sitemap is unavailable. Try again later.', {
      status: 503,
      headers: { 'Retry-After': '3600' },
    });
  }
  const albums = albumsHeld(data?.gallery)
    ? []
    : (data?.albums ?? []).flatMap((slug) => {
        const clean = cleanText(slug);
        return clean ? [albumHref(clean)] : [];
      });
  return new Response(sitemapXml([...SITEMAP_ROUTES, ...albums]), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
