# 68: The How we work chip spells 'organisation' on a site that spells 'organization'

Labels: design, later
Status: open
Blocked by: none

**Finding** (R68 in `docs/plans/review-alignment-and-quality.md`; packages/content (Impact chip); polish; drift): The chip is public copy on the grant reviewers' page and a row members read in the To do. Every other visible string on the four pages spells organization with a z.

**Evidence:** packages/content/src/pending.ts:681 what: 'your account of the organisation'; /impact shows 'Pending: your account of the organisation' (chips.js; c-im-375-a.png); the same pages and registry use US spelling: 'For organizations and funders', 'a community organization', pending.ts:634 'the doors for organizations'

**What to build:** Reword the row to 'your account of the organization'; the chip and the To do follow from the registry. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
