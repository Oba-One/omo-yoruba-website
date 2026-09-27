# 154: The page skill gives cachePage an old signature and misses the failed-read guard

Labels: infra
Status: open
Blocked by: none

**Finding** (R154 in `docs/plans/review-alignment-and-quality.md`; .claude/skills/oy-page; minor; docs): The typecheck would reject { preview }, but an agent fixing it to { draft: preview } would still drop failed, and a new route would then cache a Pending page for a day whenever a Sanity read fails. Verified against cache.ts and the pages' calls.

**Evidence:** .claude/skills/oy-page/SKILL.md:31: cachePage(Astro, route, { preview }). packages/web/src/lib/cache.ts:20-25 and :33-37 take { draft, failed }, and the pages pass { draft: preview, failed: Boolean(error) } (donate.astro:38, gala.astro:45). cache.ts:7-8: failed keeps an all-Pending render after a failed Sanity read off the CDN for a day. The signature changed in b26e2ed (Phase 5). docs/runbook.md:195-198 lists the renders that are never cached without the failed read. Also: .claude/skills/oy-page/SKILL.md:31 documents cachePage(Astro, route, { preview }) while packages/web/src/lib/cache.ts:20-25 and 33-37 take { draft, failed } and every page passes failed; SKILL.md:35-36 says primaryAction is the only gold button while packages/web/src/pages/gala.astro:134-137, odunde.astro:198-204, impact.astro:216 and get-involved.astro:132-139 render other gold actions under the one-per-view rule (e2e/helpers.ts:153-172); SKILL.md:46-47 names #give and a photo address as the only openings on load while SiteLayout.astro:83 with src/lib/forms/modal-state.ts:37-47 serves the Enquiry Modal open for ?enquiry=<kind> (ADR 0019)

**What to build:** Show the current call with draft and failed in step 7, and add the failed read to the runbook's list. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
