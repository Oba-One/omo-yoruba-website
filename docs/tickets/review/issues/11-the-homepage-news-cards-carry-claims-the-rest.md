# 11: The homepage news cards carry claims the rest of the site treats as owed

Labels: content, later
Status: open
Blocked by: none

**Finding** (R11 in `docs/plans/review-alignment-and-quality.md`; /; polish; content): The posts are the owner's real content, so nothing here is an invention, but the first page a grant reviewer sees says "fall term" where the Lessons rule says there are no terms, and a post dated November 2026 says tables are available while the Gala page shows every fact as Pending and D9 is open.

**Evidence:** seed-data.ts:331 ("Language Lessons fall term", against AGENTS.md "No terms"), :339-343 ("End-of-Year Gala", dated 2026-11-01, "Tables available now." while the Gala date, tiers and the tables decision are Pending or open). Rendered on / (/private/tmp/claude-501/-Users-afo-Code-omo-yoruba/452b50c5-d114-459b-9fb8-3a0945241754/scratchpad/lr/main/home.txt). The register calls the three posts the owner's own.

**What to build:** Ask the owner to retitle the Lessons post without "term" and to confirm or re-date the Gala post when C2 is answered. Size S. Needs the owner's decision first.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

Already recorded as open-work C2 (confirm the posts' dates); this ticket adds the review's evidence.

## Comments
