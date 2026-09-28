# 85: The To do stops asking for voices and outcomes once one exists, while the homepage and Impact keep drawing Pending slots

Labels: bug
Status: open
Blocked by: none

**Finding** (R85 in `docs/plans/review-alignment-and-quality.md`; packages/content (Pending registry, To do); major; correctness): ADR 0014 promises that the chip on the page and the row in the Studio never disagree, and the To do is how the launch gate (QUALITY section 6) finds chips. A member who adds the first voice sees the homepage and Impact rows leave the To do while two Pending voice slots stay on each page; Impact's outcome slots behave the same. pending.ts:670-676 shows the intended pattern for the stat strip (asked while fewer than six figures fill the six-cell option). Latent today (development holds no testimonial or outcome) and hit by the first voice the owner adds (open-work C2, C10). Verified by reading the builders and by running the To do's own query and state with groq-js.

**Evidence:** packages/content/src/pending.ts:836 (homepage voices[] asks only for an empty list), :725-730 (impactPage voices[]), :689-694 (impactPage outcomes[]), :879-884 (testimonial presence, minimum 1). packages/web/src/lib/sanity/homepage.ts:70-75 and impact-page.ts:156-161 fill up to three voice slots, impact-page.ts:100-108 up to four outcome slots; packages/ui/src/cards/PullQuote/PullQuote.astro:61-63 draws the registry chip in each slot. groq-js run of todoQuery and todoState on the seed with one testimonial on both pages and two outcomes on Impact: nothing owed for either page's voices or outcomes (only the Collective's one voice), while the pages draw two voice slots each and two outcome slots.

**What to build:** Give the three rows a condition that counts the slots the page draws (count(voices) < 3 on the homepage and Impact, count(outcomes) < 4 on Impact, taken from the slot lists' lengths), keeping their fields so pendingWhat still finds them, as the six-figures row already does for the stat strip; test the rows against HOMEPAGE_VOICE_SLOTS and IMPACT_OUTCOME_SLOTS. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Triage, 27 September 2026:** Ready once pull request 13 lands: it moves the outcomes' rows to Impact's page list, so the counting condition is written against that shape.
