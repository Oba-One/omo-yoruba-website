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
    expect(event.resolve({ kind: 'collective' }).locations?.[0]?.href).toBe(
      '/programs/cultural-collective',
    );
    // An edition of another kind has no page of its own, as the news cards read it: the map's order.
    const other = event.resolve({ kind: 'other' }).locations?.map((l) => l.href);
    expect(other).toEqual(TYPE_ROUTES.event);
    expect(event.resolve(null).locations?.map((l) => l.href)).toEqual(TYPE_ROUTES.event);
  });

  it('sends a Gala or organization sponsor level to the Gala page and says an Odunde one shows nowhere', () => {
    const locations = presentationOptions.resolve?.locations as Record<string, Resolver>;
    const level = locations.sponsorLevel as Resolver;
    expect(level.resolve({ scope: 'org' }).locations?.map((l) => l.href)).toEqual(['/gala']);
    const odunde = level.resolve({ scope: 'odunde' }) as {
      locations?: unknown[];
      message?: string;
    };
    expect(odunde.locations).toEqual([]);
    expect(odunde.message).toMatch(/no page/);
  });

  it('leads a program with its own page, or the map order without one', () => {
    const locations = presentationOptions.resolve?.locations as Record<string, Resolver>;
    const program = locations.program as Resolver;
    const lessons = program.resolve({ page: 'lessons' }).locations?.map((l) => l.href);
    expect(lessons?.[0]).toBe('/programs/yoruba-lessons');
    const routes = TYPE_ROUTES.program ?? [];
    expect(lessons).toEqual(expect.arrayContaining([...routes]));
    expect(program.resolve({ page: null }).locations?.map((l) => l.href)).toEqual([
      '/programs',
      ...routes.filter((route) => route !== '/programs'),
    ]);
  });
});
