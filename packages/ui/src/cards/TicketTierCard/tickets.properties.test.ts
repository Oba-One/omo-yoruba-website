import { URL } from 'node:url';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { safeHref } from '../../core/ActionButton/action';
import {
  followsAKnownScheme,
  staysOnSite,
  studioValue,
} from '../../core/ActionButton/hrefs.test-support';
import { ZEFFY_ORIGIN, zeffyPageHref } from '../../forms/ZeffyDialog/zeffy';
import { ticketsTrigger } from './tickets';

// Properties of the Get tickets trigger (ADR 0024, ADR 0052): whatever an edition's ticket link holds, the
// button opens the Tickets Dialog on Zeffy's page, opens the link the guard allows in a new tab, or is not drawn.

const zeffyEmbed = fc
  .tuple(fc.constantFrom('donation-form', 'ticketing'), fc.stringMatching(/^[a-z0-9-]{1,20}$/))
  .map(([kind, slug]) => `${ZEFFY_ORIGIN}/en-US/embed/${kind}/${slug}`);

const ticketLink = fc.oneof(studioValue, zeffyEmbed);

describe('ticketsTrigger, as properties', () => {
  it("opens the dialog only on Zeffy's own page for the form, and then in this tab", () => {
    fc.assert(
      fc.property(ticketLink, (value) => {
        const trigger = ticketsTrigger(value);
        if (!trigger?.dialog) return true;
        return (
          trigger.attributes.href === zeffyPageHref(value.trim()) &&
          new URL(trigger.attributes.href).origin === ZEFFY_ORIGIN &&
          trigger.attributes['data-tickets'] === '' &&
          trigger.attributes.target === undefined
        );
      }),
      { numRuns: 2000 },
    );
  });

  it('opens any other link the guard allows in a new tab, and that link only', () => {
    fc.assert(
      fc.property(ticketLink, (value) => {
        const trigger = ticketsTrigger(value);
        if (trigger === undefined || trigger.dialog) return true;
        expect(trigger.attributes).toEqual({
          href: safeHref(value),
          target: '_blank',
          rel: 'noopener',
        });
        return true;
      }),
      { numRuns: 2000 },
    );
  });

  it('never sends a ticket buyer to a script or off this site through a path', () => {
    fc.assert(
      fc.property(ticketLink, (value) => {
        const href = ticketsTrigger(value)?.attributes.href;
        return href === undefined || (followsAKnownScheme(href) && staysOnSite(href));
      }),
      { numRuns: 2000 },
    );
  });
});
