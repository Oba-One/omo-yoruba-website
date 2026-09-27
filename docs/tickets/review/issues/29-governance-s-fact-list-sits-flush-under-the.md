# 29: Governance's fact list sits flush under the glance box where the prototype leaves 26px, so its first rule doubles the box's border

Labels: design
Status: open
Blocked by: none

**Finding** (R29 in `docs/plans/review-alignment-and-quality.md`; /impact; minor; drift): The governance block is the legitimacy summary a reviewer reads (tax status, EIN, board, financials, then the address and the three documents). On the site the facts' top hairline runs into the glance box's bottom border at both widths, so the two blocks read as one ruled table with a doubled line. Donate's trust block, the other glance followed by a block, keeps 20px, so the gap is specific to FactList.

**Evidence:** node cap.mjs eval gov.js on #governance: site div.oy-glance bottom=382 and dl.oy-facts top=382 with margin-top 0 at 1440 (554 and 554 at 375); prototype div.oy-facts style margin-top:26px (docs/design/design/14 Impact.dc.html:223), top 408 under a glance ending at 382 (591 under 565 at 375); packages/web/src/pages/impact.astro:193-194; test-results/review/trust/c-im-1440-gov.png, c-im-375-c.png

**What to build:** Give a FactList that follows a GlanceStrip the prototype's 26px through one adjacency rule in @oy/tokens or @oy/ui (the page keeps owning no styling). Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
