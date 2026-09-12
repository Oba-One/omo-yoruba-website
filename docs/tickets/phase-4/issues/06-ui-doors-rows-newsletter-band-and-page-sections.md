# 06: DoorCard, PathRow, the newsletter band, the fixtures and the page-section stories

Labels: design
Status: resolved
Blocked by: 03, 04, 05

**What to build:** `DoorCard` (photo, title, blurb, one action; the first door gold, the rest
outline) and `PathRow` (chip, title, line, action; the accent per door) each opening its enquiry
kind or the Give Dialog through the mounted dialogs, and `NewsletterBand`, the homepage placement of
the newsletter form on the dark band. The fixtures in `packages/ui/src/fixtures` with the confirmed
facts, the register's photographs and Pending states only. One page-section story per homepage
layout option (season, highlight, gallery, involved, newsletter, pattern, motion) under Pages so the
owner compares them without touching content.

- [x] Doors and rows stories for the member and partner doors, primary and secondary, and Pending
- [x] The seven option stories render each value side by side from the fixtures
- [x] `bun run test` passes in `@oy/ui`

## Comments

12 September 2026. `cards/DoorCard`, `cards/PathRow`, `content/PathRows` (the take-part column
with its label style), `bands/NewsletterBand`, `page/HomeRoot` (the page root's data attributes
for the stories; the site puts them on the body) and `navigation/SiteFooter` gained
`newsletter={false}`. The page-section stories live in `src/pages/homepage/` (one file per
option, all wrapping `HomeRoot`, composed from `sections.ts`); the static Storybook build passes
and 142 tests in the package.
