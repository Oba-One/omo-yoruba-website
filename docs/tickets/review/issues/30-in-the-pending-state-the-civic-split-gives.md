# 30: In the Pending state the civic split gives its width to the chips (468 and 544px, not 557 and 455), so the heading wraps

Labels: design
Status: open
Blocked by: none

**Finding** (R30 in `docs/plans/review-alignment-and-quality.md`; /impact; minor; drift): The split's fr columns take their floor from min-content, and the four civic chips (Pending: the number of vendors hosted, and the rest) are wider than the prototype's figures, so the aside grows 89px and 'Odunde as civic infrastructure' breaks where it fits one line in the prototype's 557px column even in the weight-only serif. It resolves once the festival editions hold attendance, vendors hosted and the 2027 cost, which are among the last facts the owner can give (open-work C10), so the Pending layout is what reviewers see for months.

**Evidence:** node cap.mjs measure at 1440: site #civic .oy-split grid-template-columns 467.797px 544.203px, h2 87px tall on two lines; prototype 556.594px 455.406px, h2 44px on one line; glance cells 149.8 and 3 x 130.8px against 126.6, 108.3, 110.2 and 108.3px; the vendors chip runs six lines; test-results/review/trust/c-im-1440-civic.png

**What to build:** Hold the split's ratio (minmax(0, 1.1fr) minmax(0, .9fr) on .oy-split) and set a glance strip whose cells are all chips two by two, as it already stacks at 375. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
