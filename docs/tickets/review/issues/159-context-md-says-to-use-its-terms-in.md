# 159: CONTEXT.md says to use its terms in the schema, but the Studio's labels are required to avoid them

Labels: infra
Status: open
Blocked by: none

**Finding** (R159 in `docs/plans/review-alignment-and-quality.md`; CONTEXT.md; minor; docs): ADR 0042 and S3 gave members their own words and a test enforces them, but the glossary never learned them: an agent writing a field description by the glossary fails the test, and one reading a member's question about the photo viewer cannot map it. Verified against the test and the schema titles.

**Evidence:** CONTEXT.md:3-4: use these terms in code, tickets, schema, stories and copy. packages/content/src/schema/studio-words.test.ts:86-89 fails any Studio title or description containing 'Lightbox' or 'Give Dialog'. The Studio says 'In the photo viewer' (packages/content/src/layout-options.ts:180), 'Headline figure' for stat (schema/documents/content.ts:858) and 'The donation form every Donate button opens.' (schema/singletons/siteSettings.ts:116). CONTEXT.md:184 lists viewer among Lightbox's avoid words and :280 lists headline figure under Stat, while :369 itself says 'headline figures'.

**What to build:** Narrow the opening line to code, tickets, schema names, stories and site copy, and give each affected term a 'the Studio says' line (Lightbox: photo viewer; Stat: headline figure; Give Dialog: donation form). Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
