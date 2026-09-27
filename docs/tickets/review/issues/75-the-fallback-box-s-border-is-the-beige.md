# 75: The fallback box's border is the beige soft border instead of the prototype's indigo hairline

Labels: design, later
Status: open
Blocked by: none

**Finding** (R75 in `docs/plans/review-alignment-and-quality.md`; GiveDialog; polish; drift): The box nearly disappears into the white dialog on the site; the prototype's hairline gives the fallback the card edge the rest of the site uses.

**Evidence:** scratchpad chrome/give.mjs: site .oy-give-fallback border rgb(236,226,205) (--border-soft, 1.18:1 on paper) against the prototype's rgba(30,42,90,0.22) (test-results/review/chrome/give-site-1440.png, give-proto-fallback-1440.png). GiveDialog.astro:158-161.

**What to build:** border-color: var(--card-line), the tokens' indigo hairline. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
