# 107: Some Studio previews show stored codes instead of the site's words

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R107 in `docs/plans/review-alignment-and-quality.md`; packages/content (Studio previews); polish; judgement): ADR 0042 and open-work S3 put the Studio in the site's words; these lists are where a member scans for a row, and daf or annualReport is developer shorthand.

**Evidence:** Other ways to give preview their kind as stored, daf or inKind (packages/content/src/schema/singletons/index.ts:610); governance filings as form990 or annualReport (schema/documents/content.ts:1005); take-part rows as sponsor or updates (schema/objects/takePartRow.ts:60-65). studio-words.test.ts:81-85 checks option titles, not previews.

**What to build:** Prepare each preview from the titles the options already have (OTHER_WAY_TITLES, the governance option titles, KIND_TITLES and WAY_CHIPS). Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
