# 45: The check line hides the missing mailing address: it reads 'send a check to Omo Yorùbá of Southern California.' with no address and no Pending chip

Labels: bug
Status: resolved
Blocked by: none

**Finding** (R45 in `docs/plans/review-alignment-and-quality.md`; GiveDialog; major; correctness): Every Donate click shows this dialog while the Zeffy link is unset, and it asks donors to post a check with no address, which is misleading on the site's main money path. It also hides a launch-required fact (the registry's 'mailing address') on the surface where it matters most. The Studio holds the organisation name and not the address, which is the state today.

**Evidence:** scratchpad chrome/give.mjs, the site in pending mode at 1440 and 375 (test-results/review/chrome/give-site-1440.png, give-site-375.png): 'Write to us and we will take the gift by hand, or send a check to Omo Yorùbá of Southern California.' while the footer of the same page shows 'Pending: mailing address' (footer-site-impact-1440.png). packages/ui/src/forms/GiveDialog/GiveDialog.astro:53-55 joins orgName with the address lines, so a set orgName makes addressLine truthy and line 87 skips the Pending chip; GiveDialog.test.ts covers only no orgName and both set.

**What to build:** Show the Pending chip whenever the address is empty and put the organisation name only in front of a present address; add a story and a test for a name without an address. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments

**Triage, 27 September 2026:** Ready: no decision needed. Show the address Pending chip in the check line while the address is empty.

**Fixed, 27 September 2026:** on branch `feat/zeffy-embed`. The check line shows the registry's chip for the mailing address whenever the address is empty, and the organization's name only before a present address. The `FallbackNameWithoutAddress` story and its test cover the name without an address.
