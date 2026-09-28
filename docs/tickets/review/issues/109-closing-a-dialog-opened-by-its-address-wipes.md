# 109: Closing a dialog opened by its address wipes the router's history state, so a later Back changes the address but not the page

Labels: bug
Status: resolved
Blocked by: none

**Finding** (R109 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal, GiveDialog; major; correctness): The router gives the first entry {index, scrollX, scrollY} on load; when a visitor arrives by /donate#give, a shared ?enquiry=<kind> link, a new-tab open or the no-JS ?sent=1 redirect and closes the dialog, the close handler replaces that state with null. After any in-site navigation, Back lands on the null entry, which Astro's ClientRouter ignores, so the address shows the first page while the second page stays on screen. Verified by reading both close handlers against the router source; the Lightbox already avoids this by passing history.state.

**Evidence:** packages/ui/src/forms/EnquiryModal/EnquiryModal.astro:415-421 and packages/ui/src/forms/GiveDialog/GiveDialog.astro:285-288 call history.replaceState(null, ...); packages/ui/src/media/Lightbox/Lightbox.astro:292,322 keep history.state; astro 7.3.1 dist/transitions/router.js:384-391 returns early when ev.state === null, and dist/transitions/events.js:110-114 only saves scroll into a non-null state; packages/web/e2e/give.spec.ts:36-44 checks only that the hash is stripped

**What to build:** Replace with history.replaceState(history.state, '', url) in both close handlers, as the Lightbox does (ADR 0037), and add an e2e: open /#give (and ?enquiry=member), close, follow a nav link, go Back, expect the first page's content. Size S.

- [x] The fix, with a test that fails before it where the behaviour can be tested
- [x] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Triage, 27 September 2026:** Fixed by pull request 10, merged on 27 September: both close handlers now call `history.replaceState(history.state, ...)` (`EnquiryModal.astro`, `GiveDialog.astro`), and `navigation.spec.ts` checks that closing a dialog opened by its address keeps the router's history state.
