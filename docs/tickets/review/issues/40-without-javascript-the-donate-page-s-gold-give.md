# 40: Without JavaScript the Donate page's gold Give now does nothing: it links to #give, a hidden dialog

Labels: design
Status: open
Blocked by: none

**Finding** (R40 in `docs/plans/review-alignment-and-quality.md`; /donate (no-JavaScript giving path, ADR 0020); minor; drift): ADR 0020 accepts that the Give Dialog needs JavaScript and sends everyone else to the Donate page's other ways to give, but the page's one gold action is itself a link to the hidden dialog, so it neither opens anything nor scrolls to the other ways. Today the other ways are Pending (C12), which makes the dead button the only visible giving action without JavaScript.

**Evidence:** test-results/review/site/chrome.txt: with JavaScript off, the nav Donate goes to /donate#give (scrollY 0, dialog closed); the header's Give now then goes to /donate#give again with scrollY 0 and the dialog closed. Capture nojs-donate-after-donate-click-1440.png. The other ways to give sit at #other (packages/web/src/pages/donate.astro:109).

**What to build:** On the Donate page, point Give now's href at #other (keeping data-give, so JavaScript still opens the dialog), so a visitor without JavaScript lands on the other ways to give that ADR 0020 names as their path. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
