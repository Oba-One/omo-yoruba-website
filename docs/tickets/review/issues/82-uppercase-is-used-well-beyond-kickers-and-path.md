# 82: Uppercase is used well beyond kickers and path chips

Labels: design, later
Status: open
Blocked by: none

**Finding** (R82 in `docs/plans/review-alignment-and-quality.md`; every route; polish; rule-conflict): AGENTS.md says kickers and path chips are the only uppercase text, but the design system sets its small labels in capitals, and the site follows it. The labels read well, so the likely answer is to widen the rule; the 11.5px bold capitals in the year strip are the one case under the kicker size.

**Evidence:** Text with text-transform uppercase at 1440 (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/rules/*.json): Pending chips (157 on 13 routes), fact labels dt (40, 8 routes), glance labels (37, 7 routes), "Pending from you" (14), door and person roles, news card dates, zone translations, the year strip months at 11.5px and the program card when line at 13px. The status and member-led pills are recorded in ADR 0033.

**What to build:** Owner call: extend the AGENTS.md sentence to "kickers, chips and field labels", or set these labels in sentence case; raise the year strip month to 12px either way. Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
