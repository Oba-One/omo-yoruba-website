import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation';
import { PUBLIC_ROUTES, ROUTE_SINGLETONS } from '../routes';

const PAGE_TITLES: Record<string, string> = {
  homepage: 'Homepage',
  festivalPage: 'Odunde Festival',
  galaPage: 'End-of-Year Gala',
  programsPage: 'Programs',
  lessonsPage: 'Yoruba Language Lessons',
  collectivePage: 'Yoruba Cultural Collective',
  getInvolvedPage: 'Get Involved',
  impactPage: 'Impact',
  storyPage: 'Our Story',
  donatePage: 'Donate',
  galleryPage: 'Photo Gallery',
  newsPage: 'News & Events',
};

const page = (name: string) => ({
  title: PAGE_TITLES[name] ?? name,
  href: ROUTE_SINGLETONS[name] ?? '/',
});
const fixed = (...names: string[]) => ({ locations: names.map(page) });
const unlisted = (message: string) => ({ message, tone: 'caution' as const, locations: [] });

/**
 * Where each document shows, so click-to-edit and the locations banner work from /admin
 * (docs/design/CONTENT-MODEL.md section 5). The main documents resolve a route to the
 * document that owns it. Routes and types come from src/routes.ts.
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
      ...Object.fromEntries(Object.keys(ROUTE_SINGLETONS).map((name) => [name, fixed(name)])),
      siteSettings: {
        message: 'Site settings show on every page.',
        tone: 'caution',
        locations: PUBLIC_ROUTES.filter((route) => !route.includes('[')).map((route) => ({
          title: route,
          href: route,
        })),
      },
      event: defineLocations({
        select: { kind: 'kind', title: 'title' },
        resolve: (doc) => ({
          locations: [
            doc?.kind === 'gala'
              ? page('galaPage')
              : doc?.kind === 'collective'
                ? page('collectivePage')
                : page('festivalPage'),
            page('homepage'),
            page('programsPage'),
          ],
        }),
      }),
      zone: fixed('festivalPage'),
      ticketTier: fixed('galaPage'),
      sponsorLevel: defineLocations({
        select: { scope: 'scope' },
        resolve: (doc) => ({
          locations: [doc?.scope === 'odunde' ? page('festivalPage') : page('galaPage')],
        }),
      }),
      honoree: fixed('galaPage'),
      program: defineLocations({
        select: { page: 'page', name: 'name' },
        resolve: (doc) => ({
          locations: [
            page('programsPage'),
            page('homepage'),
            ...(doc?.page === 'lessons'
              ? [page('lessonsPage')]
              : doc?.page === 'collective'
                ? [page('collectivePage')]
                : []),
          ],
        }),
      }),
      initiative: fixed('collectivePage'),
      person: defineLocations({
        select: { group: 'group' },
        resolve: (doc) => ({
          locations: [
            page('storyPage'),
            ...(doc?.group === 'teacher' ? [page('lessonsPage')] : []),
          ],
        }),
      }),
      timelineEntry: fixed('storyPage'),
      testimonial: defineLocations({
        select: { context: 'context' },
        resolve: (doc) => ({
          locations: [
            page('homepage'),
            page('impactPage'),
            ...(doc?.context === 'lessons'
              ? [page('lessonsPage')]
              : doc?.context === 'collective'
                ? [page('collectivePage')]
                : []),
          ],
        }),
      }),
      newsPost: defineLocations({
        select: { title: 'title', slug: 'slug.current' },
        resolve: (doc) => ({
          locations: [
            ...(doc?.slug ? [{ title: doc.title ?? 'This post', href: `/news/${doc.slug}` }] : []),
            page('newsPage'),
            page('homepage'),
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
            page('galleryPage'),
          ],
        }),
      }),
      photographer: fixed('galleryPage'),
      partner: fixed('festivalPage', 'impactPage'),
      outcome: fixed('impactPage'),
      stat: fixed('homepage', 'impactPage'),
      door: fixed('homepage', 'getInvolvedPage', 'donatePage'),
      hometownAssociation: fixed('getInvolvedPage'),
      givingLevel: fixed('donatePage'),
      governanceDoc: fixed('impactPage'),
      enquiry: unlisted('Enquiries are not shown on the site.'),
      subscriber: unlisted('Subscribers are not shown on the site.'),
      lintReport: unlisted('Lint reports are not shown on the site.'),
    },
  },
};
