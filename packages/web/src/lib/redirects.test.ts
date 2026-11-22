import { PUBLIC_ROUTES } from '@oy/content/routes';
import { describe, expect, it } from 'vitest';
import { OLD_SITE_REDIRECTS, oldSiteRedirect } from './redirects';

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
