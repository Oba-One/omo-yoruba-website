# 77: The cross-fade uses Astro's easing, not the Site prototype's, and the progress bar flashes on every navigation

Labels: design, later
Status: open
Blocked by: none

**Finding** (R77 in `docs/plans/review-alignment-and-quality.md`; SiteLayout cross-fade and ProgressBar; polish; drift): The duration and the reduced-motion behaviour match the prototype. Astro's fade starts slowly and ends quickly where the prototype eases out, and the bar, meant for slow loads, now shows on cached pages too. Both are small, but the cross-fade is the site's only page-level motion.

**Evidence:** test-results/review/site/crossfade.txt: ::view-transition-old/new run 380ms with cubic-bezier(0.76, 0, 0.24, 1); the bar appears 147ms after the click and grows until the swap; no animation under reduced motion. Prototype: docs/design/design/Omo Yoruba Site.dc.html:146 (the veil fades with cubic-bezier(.33,0,.2,1)) and :169 (the bar shows only when the page takes longer than 220ms). Code: packages/web/src/layouts/SiteLayout.astro:106 and packages/ui/src/page/ProgressBar/ProgressBar.astro.

**What to build:** Pass a custom animation pair with the prototype's easing to transition:animate, and delay the bar's appearance by 220ms so fast navigations show only the fade. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
