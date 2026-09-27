# 03: Hide the inputs that change nothing

Labels: infra
Status: resolved
Blocked by: 01

**What to build:** S2 (spec Q3, Q4, Q8). Hide every input no page reads, the news post body and author, and the scope values that show nothing; the News page becomes an administrator's (ticket 01). Deletion waits for ticket 16. Nothing stored changes.

- [x] The event hero image, the sharing image, `keepsOwnList`, `proceedsReturn`, the Gala's extra facts, the settings' logo, second wordmark line and footer text, the post body and author, the photographer's link
- [x] The slim pages' header photo outside the Odunde and Gala pages; photo credits outside album photographs
- [x] The five unread `order` fields and their sort options; the unused sponsor and partner scope values
- [x] The to-do row asking for news post bodies goes
- [x] Tests that no to-do row names an input the form hides on its page
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026. Built on `studio/simplify`. From the code review: hidden inputs no longer block Publish (every check skips them, built-in ones included), and the to-do test walks each row's path through the schema, named types and list items included, running each step's `hidden` as the Studio does. Ticket 16 lists every hidden input and its fate in part 5. Checks at the part 4 pull request: `bun run test` 147 files and 898 tests, typecheck clean, `bun typegen` no diff, `bun run build` green; Playwright with `--workers=1` seeded 281 passed and 11 skipped, placeholder 254 passed and 38 skipped, both equal to `main`.
