# 05: Labels, help and dates in the site's words

Labels: content
Status: resolved
Blocked by: 02, 03

**What to build:** S3. Titles on every choice, help text without ADR, ticket or developer words, one name for the headline figure, pointers from the event pages to their editions, US dates and Los Angeles times. Nothing stored changes.

- [x] Titles on the 58 choice lists through a `titled()` helper; layout values titled
- [x] The 22 descriptions rewritten with the oy-voice skill
- [x] "Headline figure" everywhere in the Studio
- [x] Each event page's header points to where its edition's facts live
- [x] List, pane and lint report titles in plain words; the event type titled "Event"
- [x] Dates as `MMM D, YYYY` and times in Los Angeles (`MM/DD/YYYY h:mm A`), inputs and previews
- [x] Tests: every choice titled, no ADR or ticket words in help text or labels, date options on every date field, Los Angeles on every time
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

26 September 2026. Built on `studio/simplify`. From the code review: a date and time input shows a numeric date, because Sanity writes a month name in the browser's own zone even with a display zone set; the button option "The Give Dialog" reads "The donation form"; the help for Collective start times, routing contacts and web addresses is corrected; the lint list and the Presentation banner say "Wording to check". Checks at the part 4 pull request: `bun run test` 147 files and 898 tests, typecheck clean, `bun typegen` no diff, `bun run build` green; Playwright with `--workers=1` seeded 281 passed and 11 skipped, placeholder 254 passed and 38 skipped, both equal to `main`.
