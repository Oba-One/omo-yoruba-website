# 156: ADR 0004 promises a write token scoped to enquiries; the site holds the Editor token the seed and migrations use

Labels: infra
Status: open
Blocked by: none

**Finding** (R156 in `docs/plans/review-alignment-and-quality.md`; docs/adr/0004, the forms' write token; minor; docs): The ADR describes a boundary that does not exist: the Vercel runtime holds a credential that can change or delete any document, and it is the one used for bulk migrations. ADR 0042 records the plan limit, but the ADR the forms cite still reads as if the blast radius were two types. A separate token for the site is a judgement call for the owner.

**Evidence:** ADR 0004:3-5: 'writes an enquiry or subscriber document with a write token scoped to those types'. packages/web/src/lib/forms/site-deps.ts:18 reads SANITY_API_WRITE_TOKEN; handlers.ts:5 'write the document with the Editor token'; docs/runbook.md:19 and :274 use the same token for bun seed and every migration; setup-wizard.sh:270 names it 'enquiries write' with Editor permissions. ADR 0042:71-75 notes that only custom roles (an Enterprise plan) or another dataset could narrow it.

**What to build:** Amend ADR 0004 to say what is true (an unscoped Editor token on this plan), rename the wizard's token, and decide whether the site should get its own Editor token so the migration token can be rotated separately. Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
