---
name: oy-content-ops
description: Recipes for adding or changing site content through the Sanity MCP server. Use when the owner asks to add a news post, an event edition, an album, a person, an outcome, a governance document, a giving level, or to clear a Pending item.
---

# Content operations

The owner adds content from a Claude Code session through the Sanity MCP server in
`.mcp.json` (OAuth on first use). Shapes come from the schema in `@oy/content`; the decisions
that shaped it are ADR 0013 to ADR 0017. Editor-facing version: `docs/content-ops.md`
(Phase 10). Copy rules: the `oy-voice` skill. Datasets: `production` for the site,
`development` for trying things; the seed (`bun seed`) fills `development` with the confirmed
facts and the photographs.

## Before writing

Load the deployed schema with the MCP `get_schema` tool and read the target type. Query for an
existing document first (deterministic ids from the seed: `siteSettings`, `event-odunde-2027`,
`album-odunde-2026`, `program-yoruba-lessons`; slugs for posts and albums) so an edit patches
rather than duplicates. Ids never contain a period.

## Recipes

- **News post**: `newsPost` draft with title, slug, date (the first of the month when only the
  month is known), bilingual kicker (Yoruba with marks, English), summary, body, image from an
  existing asset or a new upload with `alt` and credit, tags. Run the voice check. Publish, or
  leave as a draft for review.
- **Event edition**: a Content Release named for the edition ("Odunde 2027", "Gala 2026").
  Inside it: the `event` with its dates, venue, cost, dress, schedule rows, vendor terms
  (festival) and tickets URL (gala), plus `ticketTier`, `sponsorLevel` and `honoree` documents
  for a gala. The page singletons rarely change. Publish the release on the announce date.
  Checklist: `/oy-release`.
- **Collective event**: an `event` with `kind` `collective`, its title, `start` (and `end` when it
  has one), the one-line summary and `venue.name`; no edition year to think about, since a collective
  event is a one-off (ADR 0030). The Collective page lists it from the moment it is published until it
  ends, or with no end until its start day ends in Los Angeles, nearest first, with "Ask to join" opening
  the contact form. An event without a start never lists, so enter it once the date is set. The venue's
  chip shows until `venue.name` is filled; the Pending view counts the events still to come.
- **Initiative**: Solar Hub and Green Goods are `initiative` documents the Collective page lists in the
  order of `collectivePage.initiatives`. The status line is the pill in the Collective's own words, set
  only from what the owner confirms ("[ How far the project has come ]"); `status`, `serves`, `since` and
  `next` are the four facts, each its own chip while empty.
- **Album**: upload photos, create `album` with cover, photos with `alt` and captions, the
  album-level `credit`, `creditConfirmed`, `consentNote`, and the `event` reference. Each photo's
  `_key` is its lightbox deep link.
- **Person**: `person` with `group` (board, staff, volunteer, teacher) and `order`, the `role`, the short
  bio and, for Our Story's `bios` option, the full bio; portrait optional (the no-portrait card is a real
  design, and a photograph never stands in for someone named). Our Story lists the board by order, then
  the staff and volunteers together; Impact's board cell counts the board. The teacher is the `person`
  `lessonsPage.teacher` points at, listed on the Lessons page only; her email there is the `teacher`
  routing contact's.
- **Outcome**: an `outcome` for a `program` or for an event page (`kind` festival or gala), never both, with
  the `figure` (the number, what it counts and its source) once something is measured, or the plain
  statement of what is being measured this year; add it to `impactPage.outcomes` in order. Impact shows
  the four subjects its prototype names (Language Lessons, the festival, Kids & STEM, the Collective) and
  keeps a chip in each one no outcome fills. A figure without its source shows the source chip.
- **Governance document**: a `governanceDoc` with its `kind` (Form 990, annual report, audit), the `year`
  and the `file`, or with no file a `note` saying when it comes ("Copies on request"). Impact reads the
  newest of each kind; the EIN and the mailing address come from `siteSettings`.
- **Giving level**: a `givingLevel` with the `amount` as shown ("$25"), `what` it pays for (it gets
  checked, so it must be true), `frequency` (once or monthly, which adds "a month") and the `source` of
  the cost; Donate shows the levels `donatePage.whatYourGiftDoes` references, in order, under its
  `impact` option. Only amounts the owner's Zeffy form offers.
- **Other way to give**: a row in `donatePage.otherWays` with its `kind` (by check, employer matching,
  in-kind goods, donor-advised fund, another way), its `title`, one line (`blurb`) and a practical `detail`.
  A check row adds the mailing address and the matching and fund rows the EIN and legal name from
  `siteSettings`, each the chip while the settings hold nothing; add only the ways the owner accepts.
- **Timeline entry**: a `timelineEntry` with the `year` ("2003", "1998 to 2002", "Today"), one line and
  `milestone` for the founding and today, referenced from `storyPage.timeline` in order. The page's
  `timeline` option stays hidden until the owner confirms the entries (wayfinder ticket 07).
- **Routing contact**: `siteSettings.contacts[]`, one entry per role with name, email, phone and
  the response line the success copy uses ("within five working days"). The `general` contact answers
  on Get Involved and Our Story; `partnerships` closes Impact.
- **Clear pending**: open Pending in the Studio (rows come from `packages/content/src/pending.ts`),
  fill the field, publish, confirm the chip is gone on the site after the purge. "Missing
  entirely" rows clear when the documents exist.
- **Enquiries**: Inbox lists them by kind, unhandled first; tick `handled` and add notes. A row
  with `notifyError` did not reach its email; fix the routing contact and the function retries
  on the next create only, so forward it by hand.

## Rules

- Never invent a figure, price, date, name or quote. If the owner asks for copy, draft it in
  the voice and leave the document as a draft for their review.
- Every image gets `alt`, a caption and a credit; mark `creditConfirmed` only on the owner's word.
- Agent Actions (Generate, Transform) are opt-in and owner-triggered; use them for alt text
  drafts and Yoruba kicker suggestions only, never on publish.
- After publishing, the webhook purges the cache (Phase 4); confirm the change on the site
  within a minute. If it does not appear, see `docs/runbook.md` (purge).
