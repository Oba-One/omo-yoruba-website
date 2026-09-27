# 26: The Collective's argument will fill its column at the prose's 66ch where the prototype holds it at 56ch

Labels: design, later
Status: open
Blocked by: none

**Finding** (R26 in `docs/plans/review-alignment-and-quality.md`; /programs/cultural-collective, why culture and sustainability sit together; polish; drift): Latent: the argument is owed (open-work C8), so the page shows its chip. Kids & STEM got its 74ch measure in Phase 6 (ADR 0033), this one did not. Verified from the prototype's inline style and the component rules; no story fills the argument.

**Evidence:** Prototype 12 Yoruba Cultural Collective.dc.html:59: .oy-prose with margin-top 18px and max-width 56ch (lines about 470px at 1440, test-results/review/programs/p12-1440-section-why.png). Site: Prose's default 66ch (packages/tokens/src/oy-components.css:2399-2400) inside the split's 515px column, so the text takes the whole column, 16px under the heading (packages/ui/src/page/Split/Split.astro:33-35).

**What to build:** Give Prose a 56ch measure and use it for the Collective's argument. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
