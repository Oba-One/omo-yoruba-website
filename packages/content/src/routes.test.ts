import { describe, expect, it } from 'vitest';
import { cacheTagsFor, PUBLIC_ROUTES, routesFor, TYPE_ROUTES } from './routes';
import { documentTypes } from './schema';

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
    ]);
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
    expect(cacheTagsFor('zone')).toEqual(['type:zone', 'route:/odunde']);
    expect(cacheTagsFor('album', 'gala-2025')).toEqual([
      'type:album',
      'route:/gallery/gala-2025',
      'route:/gallery',
      'route:/odunde',
      'route:/gala',
    ]);
    expect(cacheTagsFor('enquiry')).toEqual([]);
  });
});
