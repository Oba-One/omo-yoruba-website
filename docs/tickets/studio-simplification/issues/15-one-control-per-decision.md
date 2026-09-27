# 15: One control per decision

Labels: infra
Status: resolved
Blocked by: 09

**What to build:** S11 (spec Q7). Retire `takepart`, `emphasis` and `leadEvent`; the gold button is the hero's own.

- [x] The page views, components, stories and specs; each page renders as before
- [x] Migration `one-control`; the retired layout values in `RETIRED_FIELDS`
- [x] `bun check` green; Playwright unchanged in both data modes

## Comments

27 September 2026. Built on `studio/one-control` (pull request C).
- `TakePartBand` loses `lead` and `TicketTiers` loses `emphasis`: the rows and the tiers show in the Studio's
  order. The hero's gold button is its own whatever the highlight, and the Highlight's "festival" value is
  titled "No program", since it highlights no card. The homepage reads only the three program cards it shows.
  `lead-event.ts` has no explicit pick. The Odunde Takepart and Gala Emphasis stories go; the e2e specs check
  the first working button carries the gold.
- Migration `one-control` reads the stored lead as the site did (anything but sponsor is vendor), moves
  that row to the top and drops the option; drops `emphasis` where the tiers' order already shows it and an
  empty event pick; leaves tables emphasised against the tiers' order, or a chosen pick, to the owner; and
  notes where the highlight leans on a program. `MOVED_FIELDS` keeps `retired-fields` off the three until it
  has run. A test runs a dataset seeded before this change through `one-control` and `retired-fields` and
  gets today's seed exactly.
- Dry run on `development`: unset `takepart` (vendor, already first) and `emphasis` (seats); no pick, no note.
