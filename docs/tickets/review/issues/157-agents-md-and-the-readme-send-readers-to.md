# 157: AGENTS.md and the README send readers to the wayfinder for the owner's open decisions, which open-work.md holds

Labels: infra
Status: open
Blocked by: none

**Finding** (R157 in `docs/plans/review-alignment-and-quality.md`; AGENTS.md, README.md; minor; docs): An agent that follows the contract to learn what the owner still has to decide misses the host and dataset decisions that hold up the webhook, the preview host and launch. Verified by comparing the frontier table with open-work section 1.

**Evidence:** AGENTS.md:153-154 and README.md:54-55 call docs/plans/wayfinder.md the map and the owner's open decisions; neither links docs/plans/open-work.md. wayfinder.md:159-161 says open-work holds everything still open, and its frontier table (wayfinder.md:163-189) has no row for D2, D3, D8, D12, D17 or D24, including the two Now decisions on the public host and the dataset. wayfinder.md:157-158 names open pull requests 10 to 14, not 15. AGENTS.md:51 lists .github without lighthouse.yml, and AGENTS.md's Pointers never mention DESIGN.md.

**What to build:** Point AGENTS.md and the README at open-work.md for decisions and status, keep the wayfinder as the map, and add DESIGN.md and lighthouse.yml to AGENTS.md's lists. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
