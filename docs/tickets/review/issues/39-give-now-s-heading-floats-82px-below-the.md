# 39: Give now's heading floats 82px below the section top because the copy now centres on a taller facts column

Labels: design
Status: open
Blocked by: none

**Finding** (R39 in `docs/plans/review-alignment-and-quality.md`; /donate; minor; drift): ADR 0036 centred the copy on its facts as the prototype sets that split, which held while the copy was the taller column. Spec Q14 then removed the second paragraph and the gold Give now, so the copy (143px) is shorter than the facts (307px with chips, about 260px once filled) and centring moves the kicker and heading down instead of the facts, leaving an empty block above them. Every other section's heading starts at the padding line, so the ADR's reason no longer holds.

**Evidence:** node cap.mjs eval kids.js on #give-now at 1440: .oy-split-main top=170 (the kicker) against the content top at 88, .oy-split-aside 88 to 395; prototype copy column 88 to 405 (two paragraphs, the Give now button and its note) with the facts centred at 116 to 377; packages/web/src/pages/donate.astro:53 (Split align=center); split gap 40px against the prototype's inline 44px (16 Donate.dc.html:43); test-results/review/trust/c-dn-1440-give.png

**What to build:** Keep the copy at the top and centre only the facts (align-self: center on the aside), which is what the prototype's centring produced; take its 44px gap with it. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
