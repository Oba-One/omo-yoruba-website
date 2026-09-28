# 122: The port's header says everything else is verbatim, the README omits two additions, and two prototype switches the port kept contradict repo decisions

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R122 in `docs/plans/review-alignment-and-quality.md`; packages/tokens (oy-components.css header, README); polish; docs): A normalised diff against docs/design/design/oy-components.css confirms every other difference is documented. The two dead switches are harmless today but invite exactly what ADR 0025 and the always-visible Pending rule forbid.

**Evidence:** packages/tokens/src/oy-components.css:1-13 lists Phase 5 edits and ends 'Everything else is verbatim', though the file adds the Collective block, .pg-when, the enrol, member and updates accents, .oy-visually-hidden (:870-883) and the album tile chip (:2546-2558); packages/tokens/README.md:40-50 omits .oy-visually-hidden and the album chip; :1308-1313 keeps .oy-takepart[data-order] ... order: -1 though ADR 0025 says the prototype's order rule 'is not ported'; :1239-1241 keeps .oy-home[data-pending="off"] .oy-pend { display: none }, a switch that hides every chip; neither attribute is set anywhere (git grep)

**What to build:** List every edit in the header or point it at the README, add the two additions to the README, and drop the two dead switches as documented omissions. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
