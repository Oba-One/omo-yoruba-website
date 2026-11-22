/**
 * Search and sharing (ADR 0060): the address every page names as its own, the picture a link preview
 * shows, and the sitemap. The origin is the public host whatever host answered, so a photo address, a
 * page asked with a query, and the same page on a `vercel.app` host all name the one address search
 * engines should keep.
 */
import { SITE_ORIGIN } from '@oy/content/routes';

/** The organization's name as a link preview names the site. */
export const SITE_NAME = 'Omo Yorùbá of Southern California';

/** A link preview's picture: the size the Open Graph tags announce and its alt text. */
export interface ShareImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

/** The size link previews draw at: 1200 by 630, cropped around the photograph's focus point. */
export const SHARE_WIDTH = 1200;
export const SHARE_HEIGHT = 630;

/**
 * The picture a page without a photograph of its own shares: a copy of the homepage's hero photograph at
 * the preview size, kept in `public/` so no page reads the homepage to name it.
 */
export const DEFAULT_SHARE_IMAGE: ShareImage = {
  url: `${SITE_ORIGIN}/share.jpg`,
  width: SHARE_WIDTH,
  height: SHARE_HEIGHT,
  // The hero photograph's own alt text in the Studio.
  alt: 'The procession moves down Degnan Boulevard led by a gángan drummer in white',
};

/** The page's own address on the public host, without a query or a fragment. */
export function canonicalUrl(pathname: string): string {
  return new URL(pathname, SITE_ORIGIN).href;
}

/** The sitemap of the given paths on the public host, in the order given. */
export function sitemapXml(paths: readonly string[]): string {
  const xmlText = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const urls = paths.map((path) => `  <url><loc>${xmlText(canonicalUrl(path))}</loc></url>`);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}
