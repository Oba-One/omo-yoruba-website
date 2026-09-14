import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation';
import {
  editionRoute,
  PUBLIC_ROUTES,
  type PublicRoute,
  programRoute,
  ROUTE_SINGLETONS,
  TYPE_ROUTES,
} from '../routes';
import { singletonTypes } from '../schema/singletons';

/** The page title of each static route, from the singleton that owns it. */
const ROUTE_TITLES: Record<string, string> = Object.fromEntries(
  Object.entries(ROUTE_SINGLETONS).map(([type, route]) => [
    route,
    singletonTypes.find((t) => t.name === type)?.title ?? route,
  ]),
);

interface Location {
  title: string;
  href: string;
}

const location = (route: string): Location => ({
  title: ROUTE_TITLES[route] ?? route,
  href: route,
});
const isStatic = (route: PublicRoute) => !route.includes('[');

/** The static routes a type reaches, from the one route map, so no page is missed here. */
function locationsFor(type: string): Location[] {
  return (TYPE_ROUTES[type] ?? []).filter(isStatic).map(location);
}

/** The same list with one route moved to the front. */
function leadWith(type: string, first: string | undefined): Location[] {
  const all = locationsFor(type);
  if (!first) return all;
  return [...all.filter((l) => l.href === first), ...all.filter((l) => l.href !== first)];
}

const unlisted = (message: string) => ({ message, tone: 'caution' as const, locations: [] });

/**
 * Where each document shows, so click-to-edit and the locations banner work from /admin
 * (docs/design/CONTENT-MODEL.md section 5). Every type's list comes from src/routes.ts; the
 * resolvers below only reorder it by the document (an edition's kind, a program's page) or add
 * the document's own dynamic route (a post, an album).
 */
export const presentationOptions: PresentationPluginOptions = {
  previewUrl: {
    previewMode: {
      enable: '/api/preview/enable',
      disable: '/api/preview/disable',
    },
  },
  resolve: {
    mainDocuments: defineDocuments([
      ...Object.entries(ROUTE_SINGLETONS).map(([type, route]) => ({ route, type })),
      { route: '/gallery/:slug', filter: '_type == "album" && slug.current == $slug' },
      { route: '/news/:slug', filter: '_type == "newsPost" && slug.current == $slug' },
    ]),
    locations: {
      ...Object.fromEntries(
        Object.keys(TYPE_ROUTES)
          .filter((type) => (TYPE_ROUTES[type] ?? []).length > 0)
          .map((type) => [type, { locations: locationsFor(type) }]),
      ),
      siteSettings: {
        message: 'Site settings show on every page.',
        tone: 'caution',
        locations: PUBLIC_ROUTES.filter(isStatic).map(location),
      },
      event: defineLocations({
        select: { kind: 'kind' },
        resolve: (doc) => ({ locations: leadWith('event', editionRoute(doc?.kind)) }),
      }),
      // The Gala page shows the levels scoped to the Gala or the whole organization (galaPageQuery);
      // an Odunde-scoped level shows on no page yet, and the banner says so.
      sponsorLevel: defineLocations({
        select: { scope: 'scope' },
        resolve: (doc) =>
          doc?.scope === 'odunde'
            ? unlisted(
                'Odunde sponsor levels show on no page yet: the Gala page lists Gala and organization levels.',
              )
            : { locations: locationsFor('sponsorLevel') },
      }),
      // A program leads with the page it opens: its own, or the Programs hub that describes it. The
      // homepage stays listed for every program: it shows the first three by order, and a resolver
      // that selects fields cannot see where the other programs sit (wayfinder ticket 34).
      program: defineLocations({
        select: { page: 'page' },
        resolve: (doc) => {
          const own = programRoute(doc?.page);
          const all = locationsFor('program');
          return {
            locations: all.some((l) => l.href === own)
              ? leadWith('program', own)
              : [location(own), ...all],
          };
        },
      }),
      person: defineLocations({
        select: { group: 'group' },
        resolve: (doc) => ({
          locations: leadWith(
            'person',
            doc?.group === 'teacher' ? '/programs/yoruba-lessons' : '/our-story',
          ),
        }),
      }),
      // A lessons testimonial fills the homepage's parent slot; the Collective's shows on its page.
      testimonial: defineLocations({
        select: { context: 'context' },
        resolve: (doc) => ({
          locations: leadWith(
            'testimonial',
            doc?.context === 'collective' ? '/programs/cultural-collective' : '/',
          ),
        }),
      }),
      newsPost: defineLocations({
        select: { title: 'title', slug: 'slug.current' },
        resolve: (doc) => ({
          locations: [
            ...(doc?.slug ? [{ title: doc.title ?? 'This post', href: `/news/${doc.slug}` }] : []),
            ...locationsFor('newsPost'),
          ],
        }),
      }),
      album: defineLocations({
        select: { title: 'title', slug: 'slug.current' },
        resolve: (doc) => ({
          locations: [
            ...(doc?.slug
              ? [{ title: doc.title ?? 'This album', href: `/gallery/${doc.slug}` }]
              : []),
            ...locationsFor('album'),
          ],
        }),
      }),
      // A photographer has no page of its own, and the resolver's selection cannot look up the albums that
      // credit one, so the banner says where the credit also shows.
      photographer: {
        message: 'Also credited on the page of every album that names this photographer.',
        locations: locationsFor('photographer'),
      },
      enquiry: unlisted('Enquiries are not shown on the site.'),
      subscriber: unlisted('Subscribers are not shown on the site.'),
      lintReport: unlisted('Lint reports are not shown on the site.'),
    },
  },
};
