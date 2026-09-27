# 155: ADR 0042 amends eight ADRs and none of them points forward; ADR 0010 misstates the Studio's severity

Labels: infra
Status: open
Blocked by: none

**Finding** (R155 in `docs/plans/review-alignment-and-quality.md`; docs/adr; minor; docs): docs/agents/domain.md:9 tells agents to read the ADRs for their area, and they meet the old decision with no hint that it changed, which is how retired options come back. Verified by grepping each amended ADR for 0042 and comparing the named lines with the code.

**Evidence:** ADR 0042:76-81 amends 0006, 0013, 0014, 0023, 0024, 0025, 0029 and 0039; none of those files mentions 0042, unlike ADR 0027:26 ('Superseded by ADR 0038'). Lines now false: ADR 0014:1, :5, :9 and :18 (the Pending group and its React pane; no .tsx remains in packages/content/src); ADR 0025:9-11 (Odunde's takepart option, retired); ADR 0029:27 (keepsOwnList stays; deleted); ADR 0039:12-13 (the edition's album link, retired). ADR 0010:6 says warnings in the Studio, while packages/content/src/validation/rules.ts:16 makes the em dash an error, as phase-2 ticket 03 decided and packages/lint/README.md:5-7 says.

**What to build:** Add an 'Amended by ADR 0042: ...' line under each amended ADR's heading, following ADR 0027's convention, and correct ADR 0010's consequence. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
