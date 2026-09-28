# 34: Impact's photograph captions use the homepage tile's 13px and 16px sides where the shared mosaic sets 12.5px and 14px

Labels: design, later
Status: open
Blocked by: none

**Finding** (R34 in `docs/plans/review-alignment-and-quality.md`; /impact (PhotoTile in PhotoMosaic); polish; drift): The homepage prototype sets its .v2-mo caption inline at 13px and the shared .oy-mosaic caption is 12.5px; PhotoTile's scoped rule draws the homepage's everywhere, so the ported mosaic rule is dead code. The half pixel and the 2px sides are what wrap the Gala caption at 375.

**Evidence:** node cap.mjs eval cap5.js at 375: site figcaption 13px, padding 36px 16px 12px (packages/ui/src/media/PhotoTile/PhotoTile.astro:114-122, scoped); prototype .oy-mosaic .v2-mo figcaption 12.5px, padding 34px 14px 12px (docs/design/design/oy-components.css:548), ported at packages/tokens/src/oy-components.css:2504 but overridden by the scoped rule; 'End-of-Year Gala • 2025' wraps to two lines on the site and fits one in the prototype (test-results/review/trust/c-im-375-photos.png)

**What to build:** Let the tokens' .oy-mosaic caption rule apply on Impact (a PhotoMosaic variant, or PhotoTile leaving the caption's size and padding to the mosaic that holds it) and keep the homepage's 13px. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
