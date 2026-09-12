import { describe, expect, it } from 'vitest';
import { PUBLIC_ROUTES, TYPE_ROUTES } from '../routes';
import { documentTypes } from '../schema';
import { presentationOptions } from './presentation';

describe('presentationOptions', () => {
  it('resolves a location for every document type', () => {
    const locations = presentationOptions.resolve?.locations as Record<string, unknown> | undefined;
    expect(locations).toBeDefined();
    for (const type of documentTypes) expect(locations, type.name).toHaveProperty(type.name);
  });

  it('names a main document for every public route', () => {
    const main = (presentationOptions.resolve?.mainDocuments ?? []) as {
      route: string | string[];
    }[];
    const routes = main.flatMap((entry) =>
      Array.isArray(entry.route) ? entry.route : [entry.route],
    );
    for (const route of PUBLIC_ROUTES) {
      const expected = route.replace('[album]', ':slug').replace('[slug]', ':slug');
      expect(routes, route).toContain(expected);
    }
  });

  it('points the preview routes at the site', () => {
    expect(presentationOptions.previewUrl).toMatchObject({
      previewMode: { enable: '/api/preview/enable', disable: '/api/preview/disable' },
    });
  });
});

describe('locations follow the route map', () => {
  type Resolver = {
    select: Record<string, string>;
    resolve: (doc: Record<string, unknown> | null) => { locations?: { href: string }[] };
  };
  type Static = { locations?: { href: string }[] };

  it('lists every static route a type reads, whether the entry is fixed or resolved', () => {
    const locations = presentationOptions.resolve?.locations as Record<string, Resolver | Static>;
    for (const [type, routes] of Object.entries(TYPE_ROUTES)) {
      const entry = locations[type];
      const resolved =
        entry && 'resolve' in entry
          ? entry.resolve({
              kind: 'gala',
              scope: 'gala',
              page: 'lessons',
              group: 'teacher',
              context: 'lessons',
              slug: 'x',
              title: 'x',
            })
          : entry;
      const hrefs = (resolved?.locations ?? []).map((l) => l.href);
      for (const route of routes.filter((r) => !r.includes('[')))
        expect(hrefs, `${type} ${route}`).toContain(route);
    }
  });

  it('leads an edition with its own page', () => {
    const locations = presentationOptions.resolve?.locations as
      | Record<string, Resolver>
      | undefined;
    const event = locations?.event as Resolver;
    expect(event.resolve({ kind: 'gala' }).locations?.[0]?.href).toBe('/gala');
    expect(event.resolve({ kind: 'festival' }).locations?.[0]?.href).toBe('/odunde');
    expect(event.resolve(null).locations?.[0]?.href).toBe('/odunde');
  });
});
