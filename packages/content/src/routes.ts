/**
 * The public routes (docs/design/ROUTES-AND-INTERACTIONS.md section 1) and which document
 * types each reads. The Presentation tool, the cache tags and the webhook purge all read this
 * one map, so a type reaching a new page is registered once.
 */
export const PUBLIC_ROUTES = [
  '/',
  '/odunde',
  '/gala',
  '/programs',
  '/programs/yoruba-lessons',
  '/programs/cultural-collective',
  '/get-involved',
  '/impact',
  '/our-story',
  '/donate',
  '/gallery',
  '/gallery/[album]',
  '/news',
  '/news/[slug]',
] as const;
export type PublicRoute = (typeof PUBLIC_ROUTES)[number];

/** The singleton behind each page route. */
export const ROUTE_SINGLETONS: Record<string, PublicRoute> = {
  homepage: '/',
  festivalPage: '/odunde',
  galaPage: '/gala',
  programsPage: '/programs',
  lessonsPage: '/programs/yoruba-lessons',
  collectivePage: '/programs/cultural-collective',
  getInvolvedPage: '/get-involved',
  impactPage: '/impact',
  storyPage: '/our-story',
  donatePage: '/donate',
  galleryPage: '/gallery',
  newsPage: '/news',
};

/** Every document type and the routes that read it; an empty list means never shown. */
export const TYPE_ROUTES: Record<string, readonly PublicRoute[]> = {
  siteSettings: PUBLIC_ROUTES,
  ...Object.fromEntries(Object.entries(ROUTE_SINGLETONS).map(([type, route]) => [type, [route]])),
  event: ['/', '/odunde', '/gala', '/programs/cultural-collective', '/programs', '/news'],
  zone: ['/odunde'],
  ticketTier: ['/gala'],
  sponsorLevel: ['/gala', '/odunde'],
  honoree: ['/gala'],
  program: ['/', '/programs', '/impact'],
  initiative: ['/programs/cultural-collective'],
  person: ['/our-story', '/programs/yoruba-lessons'],
  timelineEntry: ['/our-story'],
  testimonial: ['/', '/impact', '/programs/yoruba-lessons', '/programs/cultural-collective'],
  newsPost: ['/news/[slug]', '/news', '/'],
  album: ['/gallery/[album]', '/gallery', '/odunde', '/gala'],
  photographer: ['/gallery', '/gallery/[album]'],
  partner: ['/odunde', '/impact'],
  outcome: ['/impact'],
  stat: ['/', '/impact'],
  door: ['/', '/get-involved', '/donate'],
  hometownAssociation: ['/get-involved'],
  givingLevel: ['/donate'],
  governanceDoc: ['/impact'],
  enquiry: [],
  subscriber: [],
  lintReport: [],
};

/** The routes a document affects, with its slug filled into the dynamic ones. */
export function routesFor(type: string, slug?: string): string[] {
  const routes = TYPE_ROUTES[type] ?? [];
  return routes
    .map((route) =>
      route.includes('[') ? (slug ? route.replace(/\[[^\]]+\]/, slug) : undefined) : route,
    )
    .filter((route): route is string => route !== undefined);
}

/** Cache tags: the type, then one per affected route. Phase 4 attaches them with Astro.cache. */
export function cacheTagsFor(type: string, slug?: string): string[] {
  const routes = routesFor(type, slug);
  if (routes.length === 0) return [];
  return [`type:${type}`, ...routes.map((route) => `route:${route}`)];
}
