import { PUBLIC_ROUTES } from '@oy/content/routes';
import { describe, expect, it } from 'vitest';
import { OLD_SITE_REDIRECTS, oldSiteRedirect, oldSiteRoutes, withOldSiteRoutes } from './redirects';

// The old site's addresses (docs/redirects.md, ADR 0061).

describe('oldSiteRedirect', () => {
  it('sends an old address to its successor with or without its trailing slash', () => {
    expect(oldSiteRedirect('/about-us/')).toBe('/our-story');
    expect(oldSiteRedirect('/about-us')).toBe('/our-story');
    expect(oldSiteRedirect('/About-Us/')).toBe('/our-story');
    expect(oldSiteRedirect('/executives/')).toBe('/our-story#board');
    expect(oldSiteRedirect('/yoruba-language-school/')).toBe('/programs/yoruba-lessons');
    expect(oldSiteRedirect('/event/gala-night-2022/')).toBe('/gala');
    expect(oldSiteRedirect('/2019/08/31/cultural-exchange-children-origin/')).toBe(
      '/programs#kids',
    );
    expect(oldSiteRedirect('/tag/talking-drum/')).toBe('/');
  });

  it("leaves this site's own pages, the 404 page's share of the old site and unknown paths alone", () => {
    for (const route of PUBLIC_ROUTES) expect(oldSiteRedirect(route), route).toBeUndefined();
    expect(oldSiteRedirect('/donate/')).toBeUndefined();
    expect(oldSiteRedirect('/oysocal-forum/topic/introductions/')).toBeUndefined();
    expect(oldSiteRedirect('/wp-content/uploads/2019/08/a.jpg')).toBeUndefined();
    expect(oldSiteRedirect('/author/admin/')).toBeUndefined();
    expect(oldSiteRedirect('/about-us/team')).toBeUndefined();
    expect(oldSiteRedirect('/toString')).toBeUndefined();
  });

  it('lands every old address on a page this site serves, never on another old address', () => {
    const pages = new Set<string>(PUBLIC_ROUTES);
    for (const [path, target] of Object.entries(OLD_SITE_REDIRECTS)) {
      const [page = '', section] = target.split('#');
      expect(pages.has(page), `${path} -> ${target}`).toBe(true);
      expect(oldSiteRedirect(page), `${path} -> ${target}`).toBeUndefined();
      if (section !== undefined) expect(section).toMatch(/^(board|kids)$/);
      expect(path).not.toMatch(/\/$/);
    }
    // From the old site's sitemaps: 27 pages (the events index among them), the index's 3 views, 4 events,
    // 9 posts, 3 categories and 10 tags; what docs/redirects.md leaves to the 404 page and `/donate/` are not here.
    expect(Object.keys(OLD_SITE_REDIRECTS)).toHaveLength(56);
  });
});

// Vercel matches a route's `src` against the path without its query, and without case unless the route says
// otherwise, so the `i` flag stands in for that here.
const vercelMatch = (pathname: string) =>
  oldSiteRoutes().find((route) => new RegExp(route.src ?? '', 'i').test(pathname));

describe('oldSiteRoutes', () => {
  it('match exactly what oldSiteRedirect matches, and send each to the same successor', () => {
    const probes = [
      ...Object.keys(OLD_SITE_REDIRECTS).flatMap((path) => [
        path,
        `${path}/`,
        `${path}//`,
        path.toUpperCase(),
        `${path}x`,
        `${path}/x`,
        `/x${path}`,
      ]),
      ...PUBLIC_ROUTES,
      '/donate/',
      '/oysocal-forum/topic/introductions/',
      '/2019/08/31xcultural-exchange-children-origin',
    ];
    for (const probe of probes) {
      const route = vercelMatch(probe);
      expect((route?.headers as { Location?: string } | undefined)?.Location, probe).toBe(
        oldSiteRedirect(probe),
      );
    }
  });

  it('answer 301 for GET and HEAD only', () => {
    for (const route of oldSiteRoutes()) {
      expect(route.status).toBe(301);
      expect(route.methods).toEqual(['GET', 'HEAD']);
      expect(route.caseSensitive).toBe(false);
    }
  });
});

describe('withOldSiteRoutes', () => {
  const adapterRoutes = [
    { handle: 'filesystem' },
    { src: '^/our-story/?$', dest: '_render' },
    { src: '^/.*$', dest: '_render', status: 404 },
  ];

  it("puts the old addresses ahead of the adapter's routes, once however often it runs", () => {
    const routes = withOldSiteRoutes(withOldSiteRoutes(adapterRoutes));
    expect(routes).toHaveLength(56 + adapterRoutes.length);
    expect(routes.slice(0, 56)).toEqual(oldSiteRoutes());
    expect(routes.slice(56)).toEqual(adapterRoutes);
  });

  it("fails when the adapter's 404 catch-all is gone, so the build stops rather than drop the redirects", () => {
    expect(() => withOldSiteRoutes(adapterRoutes.slice(0, 2))).toThrow(/404 catch-all/);
  });
});
