---
name: oy-content-ops
description: Recipes for adding or changing site content through the Sanity MCP server. Use when the owner asks to add a news post, an event edition, an album, a person, or to clear a Pending item.
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
- **Person**: `person` with `group` and `order`; portrait optional (the no-portrait card is a
  real design). The teacher is the `person` `lessonsPage.teacher` points at; her email on the Lessons
  page is the `teacher` routing contact's.
- **Routing contact**: `siteSettings.contacts[]`, one entry per role with name, email, phone and
  the response line the success copy uses ("within five working days").
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
