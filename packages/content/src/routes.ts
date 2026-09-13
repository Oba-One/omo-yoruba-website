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

/**
 * The page an edition opens, by its kind: the festival and the Gala have their own, a Collective
 * event opens the Collective's page, and any other kind has none. The one answer the news cards,
 * the event band and the Presentation tool share.
 */
export function editionRoute(kind: string | null | undefined): PublicRoute | undefined {
  switch (kind) {
    case 'festival':
      return ROUTE_SINGLETONS.festivalPage;
    case 'gala':
      return ROUTE_SINGLETONS.galaPage;
    case 'collective':
      return ROUTE_SINGLETONS.collectivePage;
    default:
      return undefined;
  }
}

/** The page a program opens: its own page when it has one, else the Programs hub. */
export function programRoute(page: string | null | undefined): PublicRoute {
  if (page === 'lessons') return ROUTE_SINGLETONS.lessonsPage as PublicRoute;
  if (page === 'collective') return ROUTE_SINGLETONS.collectivePage as PublicRoute;
  return ROUTE_SINGLETONS.programsPage as PublicRoute;
}

/** Every document type and the routes that read it; an empty list means never shown. */
export const TYPE_ROUTES: Record<string, readonly PublicRoute[]> = {
  siteSettings: PUBLIC_ROUTES,
  ...Object.fromEntries(Object.entries(ROUTE_SINGLETONS).map(([type, route]) => [type, [route]])),
  event: ['/', '/odunde', '/gala', '/programs/cultural-collective', '/programs', '/news'],
  zone: ['/odunde'],
  ticketTier: ['/gala'],
  sponsorLevel: ['/gala'],
  honoree: ['/gala'],
  program: ['/', '/programs', '/impact'],
  initiative: ['/programs/cultural-collective'],
  person: ['/our-story', '/programs/yoruba-lessons'],
  timelineEntry: ['/our-story'],
  testimonial: ['/', '/impact', '/programs/yoruba-lessons', '/programs/cultural-collective'],
  newsPost: ['/news/[slug]', '/news', '/'],
  album: ['/gallery/[album]', '/gallery', '/odunde', '/gala'],
  photographer: ['/gallery', '/gallery/[album]', '/odunde', '/gala'],
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

/**
 * Cache tags a published document invalidates: its type tag, then one per affected route (the
 * site's revalidate route turns each into the provider's path tag). Pages tag their responses
 * with `tagsForRoute`, so the type tag alone reaches every page that reads the type.
 */
export function cacheTagsFor(type: string, slug?: string): string[] {
  const routes = routesFor(type, slug);
  if (routes.length === 0) return [];
  return [`type:${type}`, ...routes.map((route) => `route:${route}`)];
}

/** The type tags a route's response carries: one per document type that reaches the route. */
export function tagsForRoute(route: PublicRoute): string[] {
  return Object.entries(TYPE_ROUTES)
    .filter(([, routes]) => routes.includes(route))
    .map(([type]) => `type:${type}`);
}
