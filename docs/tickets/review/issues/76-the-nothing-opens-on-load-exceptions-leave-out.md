# 76: The 'nothing opens on load' exceptions leave out ?enquiry=<kind>

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R76 in `docs/plans/review-alignment-and-quality.md`; AGENTS.md; polish; docs): The behaviour is decided and correct; the rule text reads as if it were forbidden, which could send a later agent to remove the no-JS path.

**Evidence:** AGENTS.md (Rules that lint cannot catch) names #give and the photo address as the only URL-driven exceptions, and QUALITY section 2 says 'except #give'; ADR 0019 serves the Enquiry Modal open for ?enquiry=<kind> and ?enquiry=<kind>&sent=1, verified with and without JavaScript (scratchpad chrome/served-open.mjs, nojs.mjs). Also: test-results/review/site/chrome.txt: /impact?enquiry=sponsor opens dialog#enquiry on load with JavaScript, and without it (enquiry-nojs.jsonl); unknown kinds, #enquiry alone and ?sent=1 alone open nothing. ADR 0019 made this the no-JavaScript trigger path and ADR 0037 cites it; AGENTS.md Rules that lint cannot catch lists only #give and ?photo=<key>.

**What to build:** Add ?enquiry=<kind> and its sent=1 success to the exceptions in AGENTS.md and QUALITY, citing ADR 0019. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
