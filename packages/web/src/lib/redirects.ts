/**
 * The old site's addresses and where each lands on this one (docs/redirects.md, confirmed by the owner on
 * 21 November 2026; ADR 0061). Read from the old site's own sitemaps, so every path is exact: no wildcard
 * reaches an address the old site never had. Vercel routes the build writes answer them in production, and
 * the middleware under `astro dev` and Playwright; not Astro's `redirects`: the old paths end in a slash, and
 * Astro drops it from a redirect's path while the Vercel adapter then matches the path exactly, so
 * `/about-us/` would never meet its rule. What docs/redirects.md leaves to the 404 page
 * (plugin pages, the forum, the theme's demos, author archives, the media library) has no rule, and
 * `/donate/` needs none, since it is this site's own `/donate`.
 */

const OUR_STORY = '/our-story';
const PROGRAMS = '/programs';
const LESSONS = '/programs/yoruba-lessons';
const GET_INVOLVED = '/get-involved';
const DONATE = '/donate';
const GALLERY = '/gallery';
const ODUNDE = '/odunde';
const GALA = '/gala';
const HOME = '/';

const to = (target: string, paths: readonly string[]) =>
  paths.map((path) => [path, target] as const);

export const OLD_SITE_REDIRECTS: Readonly<Record<string, string>> = Object.fromEntries([
  // Pages that have a successor.
  ...to(OUR_STORY, ['/about-us']),
  ...to(`${OUR_STORY}#board`, ['/executives']),
  ...to(PROGRAMS, ['/our-programs', '/yoruba-cultural-center']),
  ...to(LESSONS, ['/yoruba-language-school']),
  ...to(GET_INVOLVED, [
    '/faqs',
    '/membership',
    '/new-user-registration',
    '/register',
    '/login',
    '/account',
    '/logout',
    '/reset-password',
    '/contact-us',
  ]),
  ...to(DONATE, ['/thankyou', '/cancel']),
  ...to(GALLERY, ['/media-gallery', '/photos', '/videos']),
  // Events.
  ...to(HOME, [
    '/our-events',
    '/our-events/list',
    '/our-events/month',
    '/our-events/today',
    '/event/march-mixer',
  ]),
  ...to(GALA, ['/event/gala-night-2022']),
  ...to(ODUNDE, [
    '/event/omo-yoruba-cultural-enrichment-fair-2023',
    '/event/2022-oyosc-summer-conference',
    '/2021-omo-yoruba-cultural-enrichment-conference',
    '/virtual-summer-conference',
    '/cultural-enrichment-conference',
    '/rsvp-form',
    '/rsvp-form-2',
  ]),
  // Posts and archives: the site has no news (ADR 0048).
  ...to(ODUNDE, [
    '/2018/09/06/2019-cultural-enrichment-conference',
    '/2019/08/31/cultural-diversity-nigerian-foods',
  ]),
  // Cultural Exchange is off the Programs page (ADR 0056), so its post lands on the inline program beside it.
  ...to(`${PROGRAMS}#kids`, ['/2019/08/31/cultural-exchange-children-origin']),
  ...to(LESSONS, ['/2019/08/31/yoruba-language-lesson']),
  ...to(HOME, [
    '/blog',
    '/category/blog',
    '/category/news',
    '/category/uncategorized',
    '/2023/05/21/10-fundamentals-of-yoruba-culture',
    '/2023/05/21/yoruba-cuisine-a-gastronomic-delight-of-flavors-and-tradition',
    '/2023/05/21/unveiling-the-exquisite-tapestry-of-yoruba-fashion-where-tradition-meets-elegance',
    '/2023/05/21/discover-the-captivating-essence-of-yoruba-oriki-8-fundamentals-unveiled',
    '/2023/05/21/the-talking-drum-an-enchanting-beat-from-yoruba-culture',
    '/tag/clothing',
    '/tag/cuisine',
    '/tag/culture',
    '/tag/food',
    '/tag/music',
    '/tag/names',
    '/tag/oriki',
    '/tag/talking-drum',
    '/tag/tradition',
    '/tag/traditional-attire',
    '/resources',
  ]),
]);

/**
 * Where an old address lands, matched with or without its trailing slash and in any case, as WordPress
 * matched them; undefined for any other path. The middleware answers with it under `astro dev` and the
 * Playwright server; on Vercel the routes below answer first.
 */
export function oldSiteRedirect(pathname: string): string | undefined {
  const lower = pathname.toLowerCase();
  const path = lower.length > 1 ? lower.replace(/\/+$/, '') : lower;
  return Object.hasOwn(OLD_SITE_REDIRECTS, path) ? OLD_SITE_REDIRECTS[path] : undefined;
}

/** A route of Vercel's Build Output config (`.vercel/output/config.json`), as far as this file reads one. */
export interface VercelRoute {
  src?: string;
  handle?: string;
  [field: string]: unknown;
}

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * The old addresses as Vercel routes. On Vercel the middleware cannot answer them: the adapter sends every
 * path without a page to the function through a catch-all route that sets status 404, and Vercel applies that
 * status over the function's own, so the middleware's 301 left as an empty 404. These routes answer at
 * Vercel's edge before that one, with or without the trailing slash and in any case, as `oldSiteRedirect`
 * matches.
 */
export function oldSiteRoutes(): VercelRoute[] {
  return Object.entries(OLD_SITE_REDIRECTS).map(([path, target]) => ({
    src: `^${escapeRegex(path)}/*$`,
    methods: ['GET', 'HEAD'],
    caseSensitive: false,
    headers: { Location: target },
    status: 301,
  }));
}

/**
 * The adapter's routes with the old addresses in front of them. Throws when the routes lack the adapter's
 * catch-all, so a change in how the adapter routes fails the build instead of dropping the redirects quietly.
 */
export function withOldSiteRoutes(routes: readonly VercelRoute[]): VercelRoute[] {
  if (!routes.some((route) => route.src === '^/.*$' && route.status === 404)) {
    throw new Error(
      "The Vercel adapter's routes have no 404 catch-all; check the old site's routes still answer (ADR 0061).",
    );
  }
  const old = new Set(oldSiteRoutes().map((route) => route.src));
  return [...oldSiteRoutes(), ...routes.filter((route) => !old.has(route.src))];
}
