# 07: The To do view

Labels: infra
Status: resolved
Blocked by: 01

**What to build:** S8 (spec Q12). The registry's rows know their page and a list item's field; a To do view lists only what is owed, by page, with counts. Nothing stored changes.

- [x] `pending.ts`: an event row's `edition` (`next` or `past`); pages from the register's Where labels; lookups unchanged. `itemFilter` and `list[].field` move to ticket 10, their first use
- [x] `studio/todo.ts`: stable row ids, one combined count query, groups by page, Organization details for administrators, Still to add, Wording to check
- [x] `studio/todo-list.ts` (native lists, not a custom pane): drafts, live updates; replaces the Pending list and `pending-pane.tsx`
- [x] The To do counts only what the site shows: past editions only their album and attendance
- [x] Unit tests for the registry and the view; the counts before and after in the pull request
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026, from the part 4 review: the content-lint function checks every string, hidden inputs
included (`functions/content-lint/lint.ts`), so a finding can point at an input the form hides (a slim
page's header photo, a credit outside an album, the sharing image). The Wording to check section should
leave out findings on hidden paths, or the function should skip them; decide when building the view.

26 September 2026. Built on `studio/todo-sidebar`, stacked on pull request 11.

- **Native lists, one live query.** The To do is Sanity's own lists (`studio/todo-list.ts`), fed by
  one `listenQuery` that every open pane shares, rather than a custom React pane: the content package
  has no Sanity UI kit, and native lists keep the Studio's look, keyboard use and links. A list
  resolves its children from the registry by id, so a pane stays open when its row is done. The view
  opens on a counting line, so opening a document from search (Sanity's resolver waits for each
  pane's first answer) never walks into it; a failed count says so and tries again every 15 seconds,
  and the query stays open 30 seconds after the last pane closes, since the Studio closes and reopens
  panes as it moves.
- **Pages without a per-row key.** The register's Where column already names the page before its
  first comma; `REGISTER_PAGES` maps those labels (Sponsorship to the Gala, Doors to Get Involved),
  site settings rows go under Organization details, and `todo.test.ts` fails on a label it does not
  know. No registry row changed its wording or order, so the site's chips read as before.
- **What the site shows.** A row bound to an edition says which one it asks about (`edition: 'next'`
  or `'past'`), and the To do keeps only the documents of the edition the site's own rules pick
  (`pageEdition`, `pastEdition`, `collectiveEvents` in `lead-event.ts`), so the calendar reading of
  undated editions is not repeated in GROQ. An event is its own edition; the Gala's ticket tiers and
  sponsor levels name theirs, and an untied level counts every year (`everyEdition`), as the Gala page
  shows them. With no next festival or Gala edition entered, Still to add asks for one.
- **Drafts.** The To do reads drafts, as the plan says: a row leaves once its documents are fixed, even
  in a draft. An edition prepared as drafts for its announce day therefore owes nothing in the To do
  while the site still shows its Pending chips until it is published; the docs say so, and the pull
  request asks the owner whether a Ready to publish section is wanted.
- **Hidden inputs in the wording to check.** Decided: the list shows the reports as the function
  writes them. No report in either dataset has a finding today, members cannot type into a hidden
  input, and text in a hidden input never reaches a visitor. Once ticket 16 deletes the dead inputs,
  the few that stay hidden for good fit one plain rule the function can read; ticket 16 carries it.
- **Counts on `development` (26 September, a member):** before, 123 rows, 66 of them empty lists,
  and 15 presence rows in a separate pane; after, 11 pages owing 57 rows (77 documents, down from 89:
  the past editions no longer owe the next edition's facts) and 15 rows still to add.
- **Review** (two reviewers, code and tests with docs): a page search could route into the To do,
  every search click waited for its query, a failed count stuck until reload, the query restarted on
  every navigation, and tiers and levels counted across every edition; all fixed as above. The tests
  now check the query, the drafts perspective, sharing, live updates, retry and keep-alive.
- Checks: `bun run check` green (typecheck, lint, 148 test files and 925 tests); Playwright in both
  data modes equal to `main` (seeded 281 passed and 11 skipped, placeholder 254 passed and 38
  skipped).
