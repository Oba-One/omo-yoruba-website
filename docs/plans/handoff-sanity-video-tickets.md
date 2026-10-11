# Sanity videos and Gala tickets, 11 October 2026

The owner authorized finishing the Sanity setup and publishing the Odunde 2026
videos and Gala ticket form. Both are live on `www.omoyorubasocal.org`.
Main remains at `216452d3a0657bd32bf70be8bc3f7a8053b4c01f`; no application code
changed and no further deployment was needed.

## Published outcome

- Deployed the repository's full validation schema with
  `bun run --filter @oy/content sanity -- schema deploy --workspace omo-yoruba`.
  The CLI completed successfully. Sanity project `qsya7q8x`, dataset
  `development`, exact schema `_.schemas.omo-yoruba` now includes album videos.
  No MCP-managed schema or separate hosted Studio was created.
- `album-odunde-2026.videos` holds the teaser first and highlights second,
  credited to `photographer-red-carpet-media` (Red Carpet Films):
  `https://www.youtube.com/watch?v=46QkqWw418Y` and
  `https://www.youtube.com/watch?v=1ionctR6ePc`. Both were confirmed on the
  photographer's channel. The full recording was left out, matching ADR 0051's
  planned teaser and highlights.
- `event-gala-2026.ticketsUrl` is
  `https://www.zeffy.com/embed/ticketing/end-of-the-year-gala-2`, the owner's
  supplied form recorded in ADR 0052. The live form names the organization and
  shows the Gala campaign.
- `galaPage.tiersIntro` now reads: "Choose your tickets and pay through the
  ticket form on this page." The obsolete table take-part row, key `way-2`, was
  removed, following the owner's D9 decision of no tables for 2026. The page
  automatically changes its take-part introduction to three ways.

## Draft preservation and publication method

The published Odunde album has 43 photos. Its existing draft has 59. Publishing
that entire draft would have published unrelated photo edits, so only `videos`
was added to each version. All other fields in both versions are unchanged.
The existing Gallery page draft was untouched.

Reads used the Sanity connector and its exact deployed schema. The connector's
patch and publish tools operate on whole drafts, and its CLI cannot accept a
raw mutation body. Read-only payload probes confirmed its nested array fields
cannot represent this transaction safely. The local, authenticated Sanity CLI
was therefore used for the selected published fields, without reading or
printing credentials. The script and mutation payload are in `/private/tmp`
as `omo-yoruba-video-tickets-publish.mjs` and `.json`; do not replay them because
their revision guards refer to the previous content.

The transaction passed an API dry run, then updated all four documents
atomically, guarded by each document's previous revision. Applied transaction
`IwBXVgkPG5OpTGqqNUVnym` is also the resulting revision of the four documents.
Post-write comparisons confirmed that every unrelated field was preserved.
No dates, prices, ticket tiers or other event facts were changed.

## Verification and remaining content

- The production album displays both video tiles and credits. Both real
  YouTube no-cookie players loaded and played. The teaser also appears in the
  Odunde Festival page's past-years section.
- `/gala#tickets` opens the dialog and loads the real Zeffy form. The form
  shows General Admission at $100 and the campaign's date, time and address.
  No ticket was selected or purchased, and no payment information was entered.
- `PLAYWRIGHT_TEST_BASE_URL=https://www.omoyorubasocal.org bun e2e -- video.spec.ts tickets.spec.ts --workers=1`
  passed all six desktop and mobile checks, with no skips. These check lazy
  YouTube mounting, no third-party player requests before play, ticket dialog
  opening, focus restoration, Escape, and the hash-driven entry. The tests
  stub third-party frames; real frames were checked separately in the browser.
- The first request to each invalidated Gala and Odunde route served the stale
  page once. Reloading showed the new content, as the runbook describes for
  the existing webhook/cache behavior. No webhook settings were changed.
- `bun lint` and `git diff --check` passed. SHA-256 comparisons confirmed the
  owner's three pre-existing local handoff files are unchanged.

The Gala's separate pricing, dress, doors time, running order and honorees
fields still show their existing Pending content. The ticket form is usable
while those fields remain empty, as ADR 0052 specifies. The unpublished extra
album photos and Gallery consent-policy draft remain for the owner to review.

The owner's pre-existing local handoff edits are preserved. This handoff is
saved locally and is not committed. `handoff-pr-merges.md` records the earlier
merge pass; its remaining content operations are completed by this follow-up.
