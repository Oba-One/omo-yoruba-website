# CMS simplification

## Current state

The owner approved the [CMS simplification review](handoff-cms-simplification-review.md)
after identifying too many fields on each page as the main editing burden.
[PR 41](https://github.com/Oba-One/omo-yoruba-website/pull/41) is merged and live.
Local `main` and production are at `b5bc0eaa83cb760831697d2ffddb0588c90b7c5e`.
The content migration and CLI schema deployment are complete. No release work
remains. The signed-in administrator walkthrough passed on 11 October;
[walkthrough evidence](handoff-cms-walkthrough.md) records the draft edits and
restoration. A separate member Editor-account walkthrough remains untested.

Production deployment `dpl_27vKQhbNQt1EZUezu4tT51vT4HYs` is READY and serves
`https://www.omoyorubasocal.org`, with the merged main SHA confirmed in Vercel.
The implementation branch ended at `b96f3cdcc96333844a3a9f65ab027402a828e892`;
its source tree matches the squash merge.

The decision and tradeoffs are in [ADR 0053](../adr/0053-page-forms-focus-on-content.md).
The updated [editor guide](../content-ops.md) explains Content and Advanced,
edition-based creation, named detail fields and credit exceptions.

## Completed implementation

- All eleven page forms open on Content. Supporting copy, SEO overrides and
  remaining section controls are under Advanced; occasional wording starts collapsed.
- Code owns 22 settled presentation choices and ordinary header actions.
  Homepage campaign buttons, facts, prices, media and administrator publishing
  decisions retain their existing editorial authority.
- Lessons and Donate use named detail inputs. Legacy fields stay hidden and
  read-only while queries support both shapes, including partial edits during rollout.
- Edition navigation scopes albums, ticket tiers and honorees; creation fills
  the edition reference. General lists remain available.
- Album credit and consent precede photographs. Individual credit exceptions
  start collapsed. Alt text, credit confirmation and consent stay explicit.

## Validation

- Separate Spec and Standards reviews passed, including the final Storybook
  fixture corrections. No review blockers remain.
- TypeGen and the production build passed.
- Desktop and mobile browser tests: 60 passed with current content; 38 additional
  Lessons and Donate tests passed with placeholder content.
- Focused fixture and migration verification: 11 tests passed after the final repair.
- Commit hooks passed: formatting, voice and colour lints, touched package
  typechecks, 640 related unit tests and the commit-message check.
- `bun run check` passed: typechecks, lint, 1,203 unit tests and toolchain pins.
- All GitHub checks passed on the final PR head, including TypeGen drift,
  Storybook, build and desktop/mobile Lighthouse. The full browser suite reported
  283 passed, 50 skipped, and one test passed on retry.
- After deployment and migration, 42 production browser tests passed with no skips:
  `PLAYWRIGHT_TEST_BASE_URL=https://www.omoyorubasocal.org bun e2e lessons.spec.ts donate.spec.ts tickets.spec.ts --workers=1`.
- A browser comparison of Gala before and after found identical main text, links
  and layout attributes. Its real Zeffy dialog loaded General Admission at $100,
  with the confirmed date and venue. Nothing was selected or purchased.

The first full CI browser run exposed one obsolete expectation in the Collective
test, repeated on desktop and mobile: it expected no header actions without CMS
content. Ordinary actions now intentionally come from code. The repaired test
checks the exact accessible name, primary styling, sponsor enquiry round trip and
events-link visibility in both content states. Both states passed on desktop and
mobile locally; Spec and Standards reviewed the repair. Both CI runs had a
startup navigation flake in the first layout axe test, which passed on retry.
It reports an execution context destroyed by navigation, not an axe violation.
That separate test-readiness issue was left outside this CMS change.

The later signed-in administrator walkthrough verified Gala copy and ticket-price
drafts, photo-caption editing, Presentation updates and exact restoration of the
tested content. The existing Gala 2025 album draft was preserved. A separate
member Editor-account walkthrough remains untested. Compiled schema and structure
tests cover field visibility, administrator restrictions and creation references.
The shared frontend guidance doctor was unavailable locally and its registry
refresh was blocked; repository guidance and the installed skills were used.

## Content rollout

Project `qsya7q8x`, dataset `development`, workspace `omo-yoruba`.
Use the exact Studio schema ID `_.schemas.omo-yoruba`; do not create another
MCP-managed schema copy.

The `named-facts` migration was rehearsed against a full dataset export and dry-run
against the live dataset: two published documents, no conflicts. It preserves
values and notes, refuses competing new values and unknown or duplicate labels,
blocks affected drafts, and applies with revision guards in one transaction.

Verified values after migration:

- Lessons: Format `Online, live`, note `Video call`; When `Set with the teacher`;
  Cost `Agreed with her`; Ages remains unknown.
- Donate: form fallback `The dialog offers contact and a mailing address instead.`;
  fees, receipts and monthly giving remain unknown.

Following [the migration runbook](../runbook.md#migrations), the compatible
production deployment was verified before applying `named-facts`. It wrote two
published documents in one revision-guarded transaction and replanned to zero
mutations. Both now have revision `k7ZbACRkY4ac1LuB1KXiPk`. MCP reads confirmed
the values above and removal of the old fact arrays. All 14 pre-existing draft
IDs and revisions were unchanged, including the older baseline taken before rollout.

The CLI successfully deployed one schema from updated `main`:
`bun run --filter @oy/content sanity -- schema deploy --workspace omo-yoruba`.
MCP reads of exact schema `_.schemas.omo-yoruba` confirm `lessonDetails` and
`paymentDetails`. `bun seed -- --dry-run` reported zero earlier seed revisions
due and no photographs uploaded.

Rollback snapshot, retained outside the repository:
`/Users/afo/omo-yoruba-exports/development-named-facts-2026-10-11T08-37-51-528Z.before.ndjson`.
It was copied from the migration's temporary export directory and compared byte
for byte, so the retained copy survives temporary-file cleanup.
The full dataset export was removed after verification because it held private
enquiries. The rollback snapshot contains only the two affected page documents.

Do not restore old code while only the new detail objects exist. The migration
snapshot supports a revision-guarded restore if needed.

## Workspace boundaries

Existing local changes to the member-guide, PR-21 and arts-internship handoffs
belong to other work. Earlier Gala pricing, ticket/video and open-work notes are
also retained. None were included in this implementation commit.

No Sanity drafts were published or discarded by this implementation. Sanity
Functions provisioning remains the existing separate infrastructure task.
This handoff is saved locally and is not committed.
