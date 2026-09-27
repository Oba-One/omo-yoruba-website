# 108: Stale and doubled comments: two types carry two doc comments, the seed explains a link that is gone, and the skill names an old range of ADRs

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R108 in `docs/plans/review-alignment-and-quality.md`; packages/content; polish; docs): Small, but the skill is what an agent loads before changing the schema, and it names too few of the ADRs that amend the spec.

**Evidence:** packages/content/src/schema/documents/content.ts:538-542 (timelineEntry) and :793-798 (outcome) each carry two stacked doc comments, the first describing the document ADR 0042 turned into a list item; packages/content/scripts/seed.ts:102-104 says the documents reference each other, "an edition its album", a link ADR 0042 removed; .claude/skills/oy-content-model/SKILL.md:8 says the spec is amended by ADR 0013 to ADR 0017, while packages/content/README.md:63-79 lists 0024, 0025, 0029, 0031, 0034, 0035, 0039 and 0042 too.

**What to build:** Merge each pair of doc comments into one, drop the edition-to-album example from the seed comment, and point the skill at the README's list of deltas rather than a range. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
