# 08: The homepage newsletter band's email field is 200px where the band prototype sets 220px

Labels: design, later
Status: open
Blocked by: none

**Finding** (R08 in `docs/plans/review-alignment-and-quality.md`; / (NewsletterForm, newsletter: band option); polish; drift): The band option is off on the live page (newsletter: footer), so only the option's story shows it. The band heading's two-line wrap in the same story is ADR 0026's wider serif, not this.

**Evidence:** Storybook pages-homepage-newsletter--band at 1440: input w=200, form w=332; prototype with data-newsletter=band: input w=220, form w=352 (docs/design/design/02 Homepage.dc.html:353 min-width:220px). packages/ui/src/forms/NewsletterForm/NewsletterForm.astro:106-108 sets 200px for both variants. Capture test-results/review/home-events/pairs/home-1440-newsletter-band.png.

**What to build:** Set [data-variant='band'] .oy-signup .oy-input to min-width 220px and keep 200px for the footer, as the prototype does. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
