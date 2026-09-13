import { describe, expect, it } from 'vitest';
import {
  cacheTagsFor,
  EVENT_PAGE_NAMES,
  editionRoute,
  PUBLIC_ROUTES,
  programRoute,
  routesFor,
  TYPE_ROUTES,
  tagsForRoute,
} from './routes';
import { documentTypes } from './schema';

describe('editionRoute and programRoute', () => {
  it('opens the page an edition of each kind has, and none for any other kind', () => {
    expect(editionRoute('festival')).toBe('/odunde');
    expect(editionRoute('gala')).toBe('/gala');
    expect(editionRoute('collective')).toBe('/programs/cultural-collective');
    expect(editionRoute('other')).toBeUndefined();
    expect(editionRoute(null)).toBeUndefined();
    expect(editionRoute(undefined)).toBeUndefined();
  });

  it('opens a program on its own page, or on the Programs hub without one', () => {
    expect(programRoute('lessons')).toBe('/programs/yoruba-lessons');
    expect(programRoute('collective')).toBe('/programs/cultural-collective');
    expect(programRoute(null)).toBe('/programs');
    expect(programRoute('unknown')).toBe('/programs');
  });

  it("lets a program reach the Collective's page, which shows the Collective program's photograph", () => {
    expect(TYPE_ROUTES.program).toContain('/programs/cultural-collective');
    expect(tagsForRoute('/programs/cultural-collective')).toEqual(
      expect.arrayContaining(['type:program', 'type:initiative', 'type:testimonial', 'type:event']),
    );
  });

  it('answers only routes the map lists for the type', () => {
    for (const kind of ['festival', 'gala', 'collective']) {
      expect(TYPE_ROUTES.event).toContain(editionRoute(kind));
    }
    for (const page of ['lessons', 'collective', null]) {
      expect(PUBLIC_ROUTES).toContain(programRoute(page));
    }
  });
});

describe('PUBLIC_ROUTES', () => {
  it('lists every public route of ROUTES-AND-INTERACTIONS section 1', () => {
    expect(PUBLIC_ROUTES).toEqual([
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
    ]);
  });
});

describe('TYPE_ROUTES and routesFor', () => {
  it('maps every document type to at least one public route or to none on purpose', () => {
    for (const type of documentTypes) {
      expect(TYPE_ROUTES, type.name).toHaveProperty(type.name);
      for (const route of TYPE_ROUTES[type.name] ?? []) expect(PUBLIC_ROUTES).toContain(route);
    }
    expect(TYPE_ROUTES.enquiry).toEqual([]);
    expect(TYPE_ROUTES.subscriber).toEqual([]);
    expect(TYPE_ROUTES.lintReport).toEqual([]);
  });

  it('resolves a slug into the dynamic routes', () => {
    expect(routesFor('album', 'odunde-2026')).toEqual([
      '/gallery/odunde-2026',
      '/gallery',
      '/odunde',
      '/gala',
      '/impact',
    ]);
    expect(routesFor('impactPage')).toEqual(['/impact', '/donate']);
    expect(routesFor('newsPost', 'odunde-2026-recap')).toEqual([
      '/news/odunde-2026-recap',
      '/news',
      '/',
    ]);
    expect(routesFor('siteSettings')).toEqual(
      PUBLIC_ROUTES.filter((route) => !route.includes('[')),
    );
  });
});

describe('cacheTagsFor', () => {
  it('returns the type tag and one tag per affected route', () => {
    expect(cacheTagsFor('zone')).toEqual(['type:zone', 'route:/odunde', 'route:/gala']);
    expect(cacheTagsFor('album', 'gala-2025')).toEqual([
      'type:album',
      'route:/gallery/gala-2025',
      'route:/gallery',
      'route:/odunde',
      'route:/gala',
      'route:/impact',
    ]);
    expect(cacheTagsFor('enquiry')).toEqual([]);
  });
});

describe('tagsForRoute', () => {
  it('tags the homepage with every type that reaches it, the settings included', () => {
    expect(tagsForRoute('/')).toEqual([
      'type:siteSettings',
      'type:homepage',
      'type:event',
      'type:program',
      'type:testimonial',
      'type:newsPost',
      'type:stat',
      'type:door',
    ]);
  });

  it('matches the type tag a publish invalidates', () => {
    for (const tag of tagsForRoute('/odunde')) {
      const type = tag.replace('type:', '');
      expect(cacheTagsFor(type)[0]).toBe(tag);
    }
  });
});

describe('EVENT_PAGE_NAMES', () => {
  it('names each event page without a year, as the year strip and the Studio write it', () => {
    expect(EVENT_PAGE_NAMES).toEqual({ festival: 'Odunde Festival', gala: 'End-of-Year Gala' });
  });
});
