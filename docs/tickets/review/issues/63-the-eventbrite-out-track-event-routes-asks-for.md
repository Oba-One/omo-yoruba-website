# 63: The eventbrite_out track event ROUTES asks for is never announced

Labels: bug
Status: open
Blocked by: none

**Finding** (R63 in `docs/plans/review-alignment-and-quality.md`; Gala seats handoff (analytics); minor; correctness): Ticket sales are one of the site's three funnels, and the handoff to Eventbrite is the one step the site can count. The link itself is right (new tab, noopener, pointing at #seats while the link is owed), but the analytics event was never built. It matters from the day the 2026 edition's link is entered.

**Evidence:** grep: eventbrite_out appears only in docs/design/ROUTES-AND-INTERACTIONS.md:60; packages/web/src/components/Analytics.astro:4-7 lists the five events the components announce; the buy-now tier link renders target _blank rel noopener with no track (packages/ui/src/core/ActionButton/action.ts:67).

**What to build:** Announce oy:track eventbrite_out from the tier card's ticket link (a data attribute the bridge listens for on click), so the ticket funnel is counted once the edition holds its Eventbrite link. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
