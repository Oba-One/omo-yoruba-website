# 102: Closed value lists and the API version are restated instead of shared, and several exports have no importer

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R102 in `docs/plans/review-alignment-and-quality.md`; packages/content; polish; judgement): Nothing is broken today, but each restated list is a place a later change can miss, and GOVERNANCE_KINDS looks authoritative while nothing reads it. Found with git grep for each export's users.

**Evidence:** GOVERNANCE_KINDS (packages/content/src/schema/documents/content.ts:981) is used nowhere; the kinds are spelled by hand in the schema (:992-998), the Impact query (queries/trust-pages.ts:83-91) and the registry (pending.ts:911-930). The two event-page kinds are OUTCOME_KINDS (content.ts:791), the year strip's options (schema/singletons/index.ts:269-273), LeadKind (lead-event.ts:20), NEXT_EDITION_KINDS (studio/todo.ts:51) and OutcomeSlot (pending.ts:1018-1020). src/api-version.ts:1-7 says the functions pin STUDIO_API_VERSION, but functions/content-lint/index.ts:11, functions/enquiry-notify/index.ts:13, scripts/query.ts:11 and packages/web/astro.config.ts:53 each hard-code 2026-09-11. No importer: the package root src/index.ts, requiredPhrases (enquiry-kinds.ts:499, its test only), and the re-exports of PARTNER_KINDS, PERSON_GROUPS, PROGRAM_PAGES, TESTIMONIAL_CONTEXTS and enquiryTitleField (schema/documents/index.ts:1-12).

**What to build:** Build the governance options, query filters and presence rows from GOVERNANCE_KINDS; name the event-page kinds once (EVENT_PAGE_NAMES is already keyed by them); import STUDIO_API_VERSION in the functions and scripts, which already import relative src modules; drop the unused exports. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
