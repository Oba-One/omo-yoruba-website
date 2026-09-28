# 17: The inline programs' heads sit 12px higher than the prototype's and off the toggle's baseline

Labels: design, later
Status: open
Blocked by: none

**Finding** (R17 in `docs/plans/review-alignment-and-quality.md`; /programs, Disclosure (Kids & STEM, Cultural Exchange); polish; drift): The quiet 'Hide details' sits visibly lower than the kicker beside it, and everything under the head moves up 12px at both widths. Small, but these are the only heads on the three pages that do not line up like the rest. Measured with getComputedStyle on both.

**Evidence:** 1440 (test-results/review/programs/p10-1440-section-kids.png, s10-1440-section-kids.png): the prototype's .oy-sec-head is a baseline-aligned flex row that holds the button (10 Programs.dc.html:97-103; ported as packages/tokens/src/base.css:103-109), so its kicker starts 12px below the toggle's top (y 1183 against 1171), shares the toggle's baseline, and the prose starts 111px under the head; the site's toggle is absolute at the top (packages/ui/src/content/Disclosure/Disclosure.astro:42-49), the kicker sits level with its top (y 1242) and the prose starts 99px under. 375 (pair10-375-section-kids.png): prototype 30px from toggle to prose, site 18px (Disclosure.astro:63-73, margin -12px 0 18px auto). Cultural Exchange measures the same.

**What to build:** Drop the toggle 12px at the right so its label shares the kicker's baseline (or lay the head out as the prototype's baseline row), and keep 30px under the toggle below 720px. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
