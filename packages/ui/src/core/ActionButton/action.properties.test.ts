import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { safeHref } from './action';
import { followsAKnownScheme, staysOnSite, studioValue } from './hrefs.test-support';

describe('safeHref, as properties', () => {
  it('answers the value as written, trimmed, or nothing', () => {
    fc.assert(
      fc.property(studioValue, (value) => {
        const href = safeHref(value);
        return href === undefined || href === value.trim();
      }),
    );
  });

  it('never answers an address a browser follows to a script, data or any other scheme', () => {
    fc.assert(
      fc.property(studioValue, (value) => {
        const href = safeHref(value);
        return href === undefined || followsAKnownScheme(href);
      }),
      { numRuns: 2000 },
    );
  });

  it('keeps a path, fragment or query on this site', () => {
    fc.assert(
      fc.property(studioValue, (value) => {
        const href = safeHref(value);
        return href === undefined || staysOnSite(href);
      }),
      { numRuns: 2000 },
    );
  });

  it('refuses nothing a link out is made of', () => {
    fc.assert(
      fc.property(fc.webUrl({ withQueryParameters: true, withFragments: true }), (url) => {
        expect(safeHref(url)).toBe(url);
      }),
    );
  });
});
