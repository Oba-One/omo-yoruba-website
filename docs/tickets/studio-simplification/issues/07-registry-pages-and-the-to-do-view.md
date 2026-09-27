# 07: The To do view

Labels: infra
Status: open
Blocked by: 01

**What to build:** S8 (spec Q12). The registry's rows know their page and a list item's field; a To do view lists only what is owed, by page, with counts. Nothing stored changes.

- [ ] `pending.ts`: an optional `page` and `itemFilter` per row; `list[].field` conditions; lookups unchanged
- [ ] `studio/todo.ts`: stable row ids, one combined count query, groups by page, Organization details for administrators, Still to add, Wording to check
- [ ] `studio/todo-pane.tsx`: drafts, live updates; replaces the Pending list and `pending-pane.tsx`
- [ ] The To do counts only what the site shows: past editions only their album and attendance
- [ ] Unit tests for the registry and the view; the counts before and after in the pull request
- [ ] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026, from the part 4 review: the content-lint function checks every string, hidden inputs
included (`functions/content-lint/lint.ts`), so a finding can point at an input the form hides (a slim
page's header photo, a credit outside an album, the sharing image). The Wording to check section should
leave out findings on hidden paths, or the function should skip them; decide when building the view.
