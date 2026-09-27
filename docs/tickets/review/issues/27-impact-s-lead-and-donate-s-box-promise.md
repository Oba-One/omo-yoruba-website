# 27: Impact's lead and Donate's box promise a source line under every number while all four sources are Pending chips

Labels: design
Status: open
Blocked by: none

**Finding** (R27 in `docs/plans/review-alignment-and-quality.md`; /impact, /donate; minor; drift): On the page a grant reviewer checks first, the section's promise is contradicted by the four chips under it, and Donate repeats the promise as the reason to click through. ADR 0036 conditioned both on the sources option so they stay true; in the Pending state, and at launch if a source chip is accepted as visible (QUALITY section 6), they are false. The outcomes lead ('we say what is being measured this year') and the governance lead ('we say when it will be') read the same way while their chips show. Verified in the captures and the two builders; open-work C10 tracks the sources themselves, not the claim.

**Evidence:** packages/web/src/lib/sanity/impact-page.ts:46-47 and :211 (SOURCES_LEAD shown whenever layout.sources is not hidden); packages/web/src/lib/sanity/donate-page.ts:134-138 (the clause conditioned on impactSources alone); test-results/review/trust/c-im-1440-a.png and site-impact-375.png: 'Every number carries a source line: the year it covers and how it was counted.' directly over four 'Pending: a source line under the figure' chips; site-donate-1440.png: the trust box reads 'What your gift has built so far, with a source line under every number.' Also: packages/web/src/pages/programs/index.astro:152 ("What these programs have produced, with a source line under every number."), packages/web/src/pages/gala.astro:143 ("The impact page has them, with a source line under each one."), packages/web/src/lib/sanity/donate-page.ts:138 (the Donate handoff, conditioned only on Impact's sources option). /impact shows "Pending: a source line under the figure" under all four headline figures (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/main/_impact.txt).

**What to build:** Show Impact's lead and Donate's clause only when every figure Impact shows carries its source (both builders already hold the stats), the same rule that drops them under sources: hidden. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

Already recorded as open-work C10 (the sources themselves); this ticket adds the review's evidence.

## Comments
