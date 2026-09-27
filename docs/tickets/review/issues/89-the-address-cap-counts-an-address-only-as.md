# 89: The address cap counts an address only as typed, so a change of case earns five more enquiries an hour

Labels: bug
Status: open
Blocked by: none

**Finding** (R89 in `docs/plans/review-alignment-and-quality.md`; packages/content (queries/site.ts); minor; correctness): ADR 0019 and CONTEXT (Address cap) describe five enquiries an hour per reply-to address. Mail providers ignore case, so the same inbox passes the cap again with each case variant, and the two owned write paths treat the same address differently.

**Evidence:** packages/content/src/queries/site.ts:36-38 builds count(*[_type == "enquiry" && submittedAt > $since && (sponsor.mail == $email || ... || contact.mail == $email)]); packages/web/src/lib/forms/handlers.ts:147-151 passes the address as typed and stores it that way (bun probe: parseEnquiry keeps 'Person@Example.org'); the newsletter lowercases (handlers.ts:195). Also: packages/web/src/lib/forms/handlers.ts:147-158 counts fields.mail as typed and carries on when the read fails; packages/content/src/queries/site.ts:36-38 compares with ==; handlers.ts:195 lowercases only the newsletter address; packages/web/src/lib/forms/handlers.test.ts:30 answers the count for any count( query, so the cap test at lines 111-120 never checks the $email or $since it was given

**What to build:** Compare lower(kind.mail) == lower($email) in the count (GROQ has lower()), or store and query the reply-to address lowercased as the newsletter does. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
