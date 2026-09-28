# 128: A story carries an invented person's name and two stories carry unbracketed dummy EIN and address values

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R128 in `docs/plans/review-alignment-and-quality.md`; Story placeholders; polish; judgement): The rendered initials read A. B., but the name shows in the docs args panel, and a realistic EIN in a Chromatic snapshot reads like a real fact. Fixtures are otherwise clean.

**Evidence:** packages/ui/src/cards/PullQuote/PullQuote.stories.ts:37-40 (name: 'Adé Bákàrè'), initials.ts:1; GiveDialog.stories.ts:40-41 and SiteFooter.stories.ts (EIN '12-3456789', 'PO Box 000'); ContactBlock.stories.ts:9-10 and the fixtures bracket their placeholders ('[ inbox@example.org ]'); rule at COMPONENT-MAP.md:147 ('no mock names or prices')

**What to build:** Use a bracketed placeholder name for the initials story and bracket the dummy EIN and address as the other stories do. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
