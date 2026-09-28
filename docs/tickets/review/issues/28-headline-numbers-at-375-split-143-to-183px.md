# 28: Headline numbers at 375 split 143 to 183px, so each source chip in the narrow column breaks one word per line

Labels: design
Status: open
Blocked by: none

**Finding** (R28 in `docs/plans/review-alignment-and-quality.md`; /impact; minor; drift): The framed grid's 1fr columns take their floor from the widest figure: the weight-only serif (ADR 0026) sets 3,000+ at 139px against the prototype's 127, so the first column narrows to 143px (the prototype's is already uneven at 154). ADR 0036 accepts wider figures but not this knock-on: in the Pending state every source chip in the narrow column runs seven lines and the rows grow 61 to 80px, in the first screen after Impact's header on a phone. The figure size at 375 is a type decision for the owner, like D11.

**Evidence:** node cap.mjs eval stats.js at 375: site .oy-stat-grid grid-template-columns 142.516px 182.594px, '3,000+' 139px wide (OY Yoruba Serif 44px), cells 343 and 344px tall; prototype .im-stats 153.969px 171.031px, '3,000+' 127px, cells 282 and 264px; test-results/review/trust/c-im-375-a.png (the chip stacks PENDING / A / SOURCE / LINE / UNDER / THE / FIGURE under 29 and 9)

**What to build:** Give the framed grid equal columns (repeat(2, minmax(0, 1fr))) under 1000px and a phone size for its figures that fits them (about 38px under 420px), so a chip wraps in two or three lines. Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
