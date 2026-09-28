# 130: A no-JavaScript newsletter success redirects to #oy-newsletter, which does not exist when the homepage shows the band

Labels: bug
Status: open
Blocked by: none

**Finding** (R130 in `docs/plans/review-alignment-and-quality.md`; Newsletter without JavaScript; minor; correctness): With the homepage's newsletter option on band, a visitor without JavaScript who subscribes is sent to /?subscribed=1#oy-newsletter; no element has that id, so the page opens at the top and the thanks sits unseen near the bottom. The take-part Updates rows already link to #subscribe for this reason (ADR 0029), so the site has two anchors for one block. Verified by reading the redirect, both placements and the constant.

**Evidence:** packages/web/src/lib/forms/modal-state.ts:110-112 redirects to #oy-newsletter; with the band, packages/web/src/layouts/SiteLayout.astro:155 drops the footer form and packages/ui/src/bands/NewsletterBand/NewsletterBand.astro:52 names the band's form oy-newsletter-band; both containers carry id subscribe (NewsletterBand.astro:43, packages/ui/src/navigation/SiteFooter/SiteFooter.astro:138), which packages/content/src/take-part.ts:23 already exports as NEWSLETTER_ANCHOR; packages/web/src/lib/forms/modal-state.test.ts:93 pins #oy-newsletter

**What to build:** Redirect to NEWSLETTER_ANCHOR (#subscribe), which both placements carry, and update the test. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
