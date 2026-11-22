import { URL } from 'node:url';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { studioValue } from '../../core/ActionButton/hrefs.test-support';
import { ZEFFY_ORIGIN, zeffyPageHref } from './zeffy';

// Properties of the Zeffy page link (ADR 0045, ADR 0052): whatever a Studio field holds, the answer is Zeffy's
// own page for an embedded form or nothing, and every embed address Zeffy's codes write finds its page.

const PAGE_PATH = /^\/(?:[A-Za-z]{2}-[A-Za-z]{2}\/)?(?:donation-form|ticketing)\/[^/]+$/;

/** An embed address as Zeffy's codes write it, with any query, the pop-up's `modal` among them. */
const embedAddress = fc
  .record({
    locale: fc.option(fc.constantFrom('en-US', 'fr-CA', 'es-MX'), { nil: undefined }),
    kind: fc.constantFrom('donation-form', 'ticketing'),
    slug: fc.stringMatching(/^[a-z0-9][a-z0-9-]{0,30}$/),
    query: fc.array(
      fc.tuple(fc.constantFrom('modal', 'lang', 'utm_source', 'x'), fc.string({ maxLength: 8 })),
      { maxLength: 3 },
    ),
  })
  .map(({ locale, kind, slug, query }) => {
    const url = new URL(`${ZEFFY_ORIGIN}${locale ? `/${locale}` : ''}/embed/${kind}/${slug}`);
    for (const [key, value] of query) url.searchParams.append(key, value);
    return { address: url.href, locale, kind, slug };
  });

describe('zeffyPageHref, as properties', () => {
  it("answers Zeffy's own page for a form, over https, without the pop-up's parameter, or nothing", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          studioValue,
          embedAddress.map((embed) => embed.address),
        ),
        (value) => {
          const page = zeffyPageHref(value);
          if (page === undefined) return true;
          const url = new URL(page);
          return (
            url.origin === ZEFFY_ORIGIN &&
            PAGE_PATH.test(url.pathname) &&
            !url.pathname.includes('/embed/') &&
            !url.searchParams.has('modal')
          );
        },
      ),
      { numRuns: 2000 },
    );
  });

  it('finds the page for every embed address, the form named as it was', () => {
    fc.assert(
      fc.property(embedAddress, ({ address, locale, kind, slug }) => {
        const page = zeffyPageHref(address);
        expect(page).toBeDefined();
        expect(new URL(page as string).pathname).toBe(
          `${locale ? `/${locale}` : ''}/${kind}/${slug}`,
        );
      }),
    );
  });

  it("answers nothing for a page address, so a page is never mistaken for a form's embed", () => {
    fc.assert(
      fc.property(embedAddress, ({ address }) => {
        expect(zeffyPageHref(zeffyPageHref(address))).toBeUndefined();
      }),
    );
  });
});
