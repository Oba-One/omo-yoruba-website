# 08: The sidebar follows the site

Labels: infra
Status: resolved
Blocked by: 07

**What to build:** S7 (spec Q12, the sidebar). The Studio's sidebar is arranged the way the site is. Nothing stored changes.

- [x] The approved tree, written in `structure.ts` one function per branch (no separate spec)
- [x] Governance documents under Pages, then Impact
- [x] Tests per role: every document type reachable once, administrators' extra items, no Other list
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026. Built on `studio/todo-sidebar`, stacked on pull request 11. The tree reads as the
spec draws it: To do, News posts, Events (Odunde Festival with Editions and zones, the End-of-Year
Gala with Editions, tiers, levels and honorees, Collective events), Photos, People, Pages, Used on
several pages, then Site settings and the Inbox for administrators. The tree lives in
`structure.ts` itself rather than in a separate plain spec: a spec would describe the same tree
twice, and the tests walk the built sidebar instead, checking that every document type opens in one
place (events and enquiries by kind), per role. The page names come from `studio/site-pages.ts`,
which the To do's groups share. Until ticket 10 turns them into page lists, initiatives, outcomes,
timeline entries and giving levels open beside their page, and the event pages' pointers now read
"Events, then Odunde Festival, then Editions".
